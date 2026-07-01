import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { MetaPublishingService } from './meta-publishing.service';
import { PublicationQueueService, PublicationJob } from './publication-queue.service';

type TimelineEntry = { event: string; occurredAt: string; detail?: string };

@Injectable()
export class PublicationWorkerService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(PublicationWorkerService.name);
  private running = false;
  private schedulerLoop: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly queue: PublicationQueueService,
    private readonly prisma: PrismaService,
    private readonly metaPublishing: MetaPublishingService,
  ) {}

  onApplicationBootstrap() {
    this.startConsumer();
    this.startSchedulerLoop();
  }

  onApplicationShutdown() {
    this.running = false;
    if (this.schedulerLoop) clearInterval(this.schedulerLoop);
  }

  // ─── Scheduler Loop ───────────────────────────────────────────────────────
  // Every 30 seconds, pop all due scheduled jobs and enqueue them
  private startSchedulerLoop() {
    this.schedulerLoop = setInterval(async () => {
      const dueJobs = await this.queue.popDueScheduled();
      for (const job of dueJobs) {
        this.logger.log(`Scheduled job due — enqueuing: ${job.publicationId}`);
        await this.queue.enqueue(job);
      }
    }, 30_000);
  }

  // ─── Queue Consumer ───────────────────────────────────────────────────────
  private startConsumer() {
    this.running = true;
    // Run as a detached async loop — does not block NestJS boot
    (async () => {
      this.logger.log('Publication Worker started — listening for jobs');
      while (this.running) {
        try {
          const job = await this.queue.consume(5);
          if (job) {
            await this.processJob(job);
          }
        } catch (err) {
          this.logger.error('Worker loop error', err);
          // Brief pause to prevent CPU spin on persistent error
          await new Promise(res => setTimeout(res, 2000));
        }
      }
      this.logger.log('Publication Worker stopped');
    })();
  }

  // ─── Job Processor ────────────────────────────────────────────────────────
  private async processJob(job: PublicationJob): Promise<void> {
    const { publicationId, caption, imageUrls, pageId, retryCount } = job;
    this.logger.log(`Processing job: ${publicationId} (attempt ${retryCount + 1})`);

    const timeline: TimelineEntry[] = [];
    const addEvent = (event: string, detail?: string) =>
      timeline.push({ event, occurredAt: new Date().toISOString(), detail });

    try {
      // 1. Mark as Queued → Publishing
      addEvent('WorkerAssigned');
      await this.updatePublicationStatus(publicationId, 'Publishing', timeline);

      // 2. Resolve credential
      addEvent('CredentialResolved');
      const credential = await this.findCredential(job.businessId, pageId);
      if (!credential) {
        addEvent('CredentialNotFound', `No credential for pageId: ${pageId}`);
        await this.updatePublicationStatus(publicationId, 'Failed', timeline, 'No credential found');
        return;
      }

      // 3. Call Meta API
      addEvent('PublishingStarted');
      const success = await this.metaPublishing.executePublish(
        credential, publicationId, caption, imageUrls, pageId
      );

      if (success) {
        addEvent('PublishingFinished');
        addEvent('Completed');
        await this.updatePublicationStatus(publicationId, 'Published', timeline);
        this.logger.log(`Job ${publicationId} published successfully`);
      } else {
        addEvent('PublishingFailed', 'Meta API returned failure');
        // Determine retry strategy
        await this.handleFailure(job, timeline, 'Meta API publish failed');
      }
    } catch (err) {
      addEvent('Error', err.message);
      await this.handleFailure(job, timeline, err.message);
    }
  }

  private async handleFailure(job: PublicationJob, timeline: TimelineEntry[], error: string) {
    if (job.retryCount >= 3) {
      // Send to DLQ — permanent failure
      timeline.push({ event: 'MovedToDLQ', occurredAt: new Date().toISOString(), detail: error });
      await this.updatePublicationStatus(job.publicationId, 'Failed', timeline, error);
      await this.queue.sendToDlq(job, error);
    } else {
      // Requeue with exponential backoff
      timeline.push({ event: 'Retrying', occurredAt: new Date().toISOString(), detail: `Attempt ${job.retryCount + 1}/3` });
      await this.updatePublicationStatus(job.publicationId, 'Retrying', timeline, error);
      await this.queue.requeueWithBackoff(job);
    }
  }

  private async updatePublicationStatus(
    publicationId: string,
    status: string,
    timeline: TimelineEntry[],
    error?: string,
  ) {
    try {
      const current = await this.prisma.publication.findUnique({ where: { id: publicationId } });
      const existingMeta = (current?.metadata as any) || {};
      const existingTimeline: TimelineEntry[] = existingMeta.timeline || [];

      await this.prisma.publication.update({
        where: { id: publicationId },
        data: {
          status,
          publishedAt: status === 'Published' ? new Date() : undefined,
          metadata: {
            ...existingMeta,
            timeline: [...existingTimeline, ...timeline],
            lastError: error,
            lastUpdatedAt: new Date().toISOString(),
          },
        },
      });
    } catch (err) {
      this.logger.error(`Failed to update Publication ${publicationId} status`, err);
    }
  }

  private async findCredential(businessId: string, pageId: string) {
    const credentials = await this.prisma.credential.findMany({
      where: { businessId, status: 'ACTIVE', isDeleted: false },
      include: { secrets: true },
    });
    for (const cred of credentials) {
      const meta = cred.metadata as any;
      if (meta?.pages) {
        for (const page of meta.pages) {
          if (page.id === pageId || page.instagram?.id === pageId) return cred;
        }
      }
    }
    return null;
  }

  // ─── Worker Status ─────────────────────────────────────────────────────────
  getStatus() {
    return {
      running: this.running,
      redisConnected: this.queue.isAvailable(),
      startedAt: new Date().toISOString(),
    };
  }
}
