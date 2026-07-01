import { Injectable, Logger } from '@nestjs/common';
import { Campaign } from '../../../campaign/domain/aggregate/Campaign';
import { PublicationGroup, PublicationGroupStatus, PublicationGroupId } from '../../../campaign/domain/entities/PublicationGroup';
import { ExecutionStrategy } from '../../../campaign/domain/enums/ExecutionStrategy';
import { PublicationQueueService, PublicationJob } from '../../../publishing/publication-queue.service';
import { Publication } from '../../../campaign/domain/entities/Publication';

@Injectable()
export class CampaignOrchestratorService {
  private readonly logger = new Logger(CampaignOrchestratorService.name);

  constructor(
    private readonly publicationQueueService: PublicationQueueService,
  ) {}

  public async orchestrateCampaign(campaign: Campaign): Promise<PublicationGroup> {
    this.logger.log(`Orchestrating campaign ${campaign.id.value}`);

    const strategy = campaign.executionStrategy || ExecutionStrategy.Sequential;
    const publications = campaign.publications;
    const publicationIds = publications.map(p => p.id.value);

    // Create the Publication Group
    const group = PublicationGroup.create({
      campaignId: campaign.id.value,
      status: PublicationGroupStatus.Running,
      publicationIds,
      startedAt: new Date(),
    }, PublicationGroupId.create(`pg-${Date.now()}`));

    // Schedule publications based on strategy
    await this.applyStrategy(strategy, publications, campaign, group.id.value);

    return group;
  }

  private async applyStrategy(
    strategy: ExecutionStrategy,
    publications: Publication[],
    campaign: Campaign,
    groupId: string,
  ): Promise<void> {
    const now = Date.now();
    let offsetMs = 0;
    
    // Base configuration for offsets
    const BASE_OFFSET = 2 * 60 * 1000; // 2 minutes

    for (let i = 0; i < publications.length; i++) {
      const pub = publications[i];
      const job: PublicationJob = {
        publicationId: pub.id.value,
        campaignId: campaign.id.value,
        businessId: 'mock-business-id', // Would come from context
        caption: pub.metadata?.caption as string || '',
        imageUrls: pub.metadata?.imageUrls as string[] || [],
        pageId: pub.metadata?.pageId as string || '',
        provider: pub.format.value,
        retryCount: 0,
        enqueuedAt: new Date().toISOString(),
      };

      if (strategy === ExecutionStrategy.Sequential) {
        // Offset each publication sequentially
        offsetMs = i * BASE_OFFSET;
      } else if (strategy === ExecutionStrategy.Parallel || strategy === ExecutionStrategy.Batch) {
        // All at once
        offsetMs = 0;
      } else if (strategy === ExecutionStrategy.Priority) {
        // Priority logic (simplified)
        offsetMs = i * (BASE_OFFSET / 2);
      } else if (strategy === ExecutionStrategy.AIOptimized) {
        // AI logic placeholder
        offsetMs = i * 1000; // minimal offset for now
      }

      if (offsetMs > 0) {
        const runAt = new Date(now + offsetMs);
        job.scheduledFor = runAt.toISOString();
        await this.publicationQueueService.scheduleAt(job, runAt);
      } else {
        await this.publicationQueueService.enqueue(job);
      }
    }
  }

  public async pauseCampaign(campaign: Campaign): Promise<void> {
    // In a real system, we'd find pending jobs in Redis and remove them or mark them paused.
    this.logger.log(`Pausing campaign ${campaign.id.value}`);
    campaign.pause();
  }

  public async resumeCampaign(campaign: Campaign): Promise<void> {
    this.logger.log(`Resuming campaign ${campaign.id.value}`);
    // We would re-enqueue remaining jobs here
  }

  public async cancelCampaign(campaign: Campaign): Promise<void> {
    this.logger.log(`Cancelling campaign ${campaign.id.value}`);
    campaign.cancel();
    // Would remove scheduled jobs from Redis
  }
}
