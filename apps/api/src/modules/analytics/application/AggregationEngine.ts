import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { NormalizedMetricsDto } from '../domain/AnalyticsTypes';
import { CampaignAnalyticsUpdated, BusinessAnalyticsUpdated, WorkspaceAnalyticsUpdated } from '../domain/events/AnalyticsEvents';
import { KPIEngine } from './KPIEngine';

@Injectable()
export class AggregationEngine {
  private readonly logger = new Logger(AggregationEngine.name);

  constructor(
    private readonly eventBus: EventBus,
    private readonly kpiEngine: KPIEngine,
  ) {}

  public async aggregatePublicationMetrics(publicationId: string, metrics: NormalizedMetricsDto, campaignId: string, businessId: string, workspaceId: string): Promise<void> {
    this.logger.log(`Aggregating metrics upward from Publication ${publicationId}`);

    // In reality, this queries the DB for all publications in the campaign, sums them up
    // For prototype, we mock the rollup calculation
    const campaignMetrics = this.mockRollup('Campaign', campaignId, metrics);
    this.eventBus.publish(new CampaignAnalyticsUpdated(campaignId, campaignMetrics));

    const businessMetrics = this.mockRollup('Business', businessId, campaignMetrics);
    this.eventBus.publish(new BusinessAnalyticsUpdated(businessId, businessMetrics));

    const workspaceMetrics = this.mockRollup('Workspace', workspaceId, businessMetrics);
    this.eventBus.publish(new WorkspaceAnalyticsUpdated(workspaceId, workspaceMetrics));
  }

  private mockRollup(entityType: 'Campaign' | 'Business' | 'Workspace', entityId: string, baseMetrics: NormalizedMetricsDto): NormalizedMetricsDto {
    const rolledUp = {
      ...baseMetrics,
      entityId,
      entityType,
      calculatedAt: new Date(),
    };
    return this.kpiEngine.calculateDerivedMetrics(rolledUp);
  }
}
