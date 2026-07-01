import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { MetaPublishingService } from './meta-publishing.service';
import { PublicationQueueService, PublicationJob } from './publication-queue.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PublishingService {
  private readonly logger = new Logger(PublishingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metaPublishing: MetaPublishingService,
    private readonly queue: PublicationQueueService,
  ) {}

  // ─── Asset Upload ──────────────────────────────────────────────────────────
  async uploadAsset(file: any, workspaceId: string, businessId: string) {
    const assetId = uuidv4();
    const mediaType = file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE';
    const publicUrl = `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(file.originalname)}`;

    await this.prisma.asset.create({
      data: {
        id: assetId,
        workspaceRef: workspaceId,
        businessId,
        status: 'READY',
        mediaType,
        mimeType: file.mimetype,
        fileSize: file.size,
        metadata: { originalName: file.originalname, url: publicUrl },
      },
    });

    return { assetId, url: publicUrl };
  }

  // ─── Draft ─────────────────────────────────────────────────────────────────
  async createDraft(payload: any) {
    const { workspaceId, businessId, caption, assetIds, targetChannels } = payload;
    const contentId = uuidv4();
    const campaignId = uuidv4();

    await this.prisma.$transaction(async (tx) => {
      await tx.campaign.create({
        data: {
          id: campaignId,
          workspaceRef: workspaceId,
          businessId,
          name: 'Direct Post ' + new Date().toISOString(),
          status: 'Draft',
          priority: 'Medium',
          objective: 'Engagement',
          strategy: 'Manual',
          budget: {},
        },
      });

      await tx.content.create({
        data: {
          id: contentId,
          workspaceRef: workspaceId,
          status: 'DRAFT',
          title: 'Post Content',
          body: caption,
          metadata: { assetIds },
        },
      });

      for (const target of targetChannels) {
        await tx.publication.create({
          data: {
            id: uuidv4(),
            campaignId,
            status: 'Draft',
            format: 'POST',
            contentId,
            metadata: {
              provider: target.provider,
              pageId: target.pageId,
              timeline: [{ event: 'Created', occurredAt: new Date().toISOString() }],
            },
          },
        });
      }
    });

    return { success: true, campaignId, contentId };
  }

  // ─── Publish (enqueue) ─────────────────────────────────────────────────────
  async publish(payload: any) {
    const { workspaceId, businessId, caption, assetIds, targetChannels, publishAt } = payload;

    // Persist to DB first
    const draft = await this.createDraft(payload);

    // Retrieve the created publications
    const publications = await this.prisma.publication.findMany({
      where: { campaignId: draft.campaignId },
    });

    // Resolve asset URLs
    const assets = assetIds?.length
      ? await this.prisma.asset.findMany({ where: { id: { in: assetIds } } })
      : [];
    const imageUrls = assets.map((a) => (a.metadata as any).url).filter(Boolean);

    const scheduledDate = publishAt ? new Date(publishAt) : null;
    const isScheduled = scheduledDate && scheduledDate > new Date();

    const enqueuedIds: string[] = [];

    for (const pub of publications) {
      const targetMeta = pub.metadata as any;

      // Mark status as Queued or Scheduled
      const newStatus = isScheduled ? 'Scheduled' : 'Queued';
      const timeline = [
        ...(targetMeta.timeline || []),
        { event: newStatus, occurredAt: new Date().toISOString() },
      ];

      await this.prisma.publication.update({
        where: { id: pub.id },
        data: {
          status: newStatus,
          publishAt: scheduledDate ?? null,
          metadata: { ...targetMeta, timeline },
        },
      });

      const job: PublicationJob = {
        publicationId: pub.id,
        campaignId: draft.campaignId,
        businessId,
        caption,
        imageUrls,
        pageId: targetMeta.pageId,
        provider: targetMeta.provider,
        retryCount: 0,
        enqueuedAt: new Date().toISOString(),
        scheduledFor: scheduledDate?.toISOString(),
      };

      if (isScheduled) {
        // Schedule for later using sorted set
        if (this.queue.isAvailable()) {
          await this.queue.scheduleAt(job, scheduledDate!);
        } else {
          // In-process fallback: execute after the delay
          const delayMs = scheduledDate!.getTime() - Date.now();
          setTimeout(() => this.executeInProcess(pub.id, job), Math.max(delayMs, 0));
        }
      } else {
        // Publish now — enqueue immediately
        if (this.queue.isAvailable()) {
          await this.queue.enqueue(job);
        } else {
          // In-process fallback: execute immediately
          this.executeInProcess(pub.id, job);
        }
      }

      enqueuedIds.push(pub.id);
    }

    return {
      success: true,
      queued: enqueuedIds.length,
      scheduled: isScheduled ? scheduledDate?.toISOString() : null,
      publicationIds: enqueuedIds,
    };
  }

  // ─── In-process fallback (no Redis) ───────────────────────────────────────
  private async executeInProcess(publicationId: string, job: PublicationJob) {
    this.logger.log(`[IN-PROCESS] Executing job ${publicationId} directly`);
    const credential = await this.findCredentialForTarget(job.businessId, job.pageId);
    if (!credential) {
      await this.prisma.publication.update({
        where: { id: publicationId },
        data: { status: 'Failed' },
      });
      return;
    }
    const success = await this.metaPublishing.executePublish(
      credential, publicationId, job.caption, job.imageUrls, job.pageId
    );
    await this.prisma.publication.update({
      where: { id: publicationId },
      data: { status: success ? 'Published' : 'Failed', publishedAt: success ? new Date() : undefined },
    });
  }

  // ─── Credential Resolver ───────────────────────────────────────────────────
  async findCredentialForTarget(businessId: string, pageId: string) {
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

  // ─── History ───────────────────────────────────────────────────────────────
  async getHistory(workspaceId: string) {
    return this.prisma.campaign.findMany({
      where: { workspaceRef: workspaceId },
      include: { publications: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getStatus(id: string) {
    return this.prisma.publication.findUnique({ where: { id } });
  }

  async retry(publicationId: string) {
    const pub = await this.prisma.publication.findUnique({ where: { id: publicationId } });
    if (!pub) return { success: false, error: 'Not found' };

    const meta = pub.metadata as any;
    const job: PublicationJob = {
      publicationId,
      campaignId: pub.campaignId,
      businessId: meta.businessId || '',
      caption: meta.caption || '',
      imageUrls: meta.imageUrls || [],
      pageId: meta.pageId || '',
      provider: meta.provider || '',
      retryCount: 0,
      enqueuedAt: new Date().toISOString(),
    };

    await this.prisma.publication.update({
      where: { id: publicationId },
      data: { status: 'Queued' },
    });

    if (this.queue.isAvailable()) {
      await this.queue.enqueue(job);
    }

    return { success: true, status: 'Queued' };
  }

  async deletePublication(publicationId: string) {
    await this.prisma.publication.update({
      where: { id: publicationId },
      data: { status: 'Cancelled' },
    });
    return { success: true };
  }
}
