import { Injectable, Logger } from '@nestjs/common';
import { BusinessHealthDto, OperationsSummaryDto } from '../domain/OperationsTypes';
import { WorkerRegistryService } from '../../worker/application/WorkerRegistryService';
import { WorkerStatus } from '../../worker/domain/WorkerTypes';

@Injectable()
export class BusinessHealthAggregator {
  private readonly logger = new Logger(BusinessHealthAggregator.name);

  constructor(private readonly workerRegistry: WorkerRegistryService) {}

  /**
   * Calculates a composite Business Health Score (0-100).
   * Weights: Automation 40% | Campaign 30% | Worker 20% | Analytics 10%
   */
  public calculateHealth(): BusinessHealthDto {
    const automationHealth = this.measureAutomationHealth();
    const campaignHealth   = this.measureCampaignHealth();
    const publicationHealth = this.measurePublicationHealth();
    const workerHealth     = this.measureWorkerHealth();
    const analyticsHealth  = this.measureAnalyticsHealth();

    const overallScore = Math.round(
      automationHealth * 0.40 +
      campaignHealth   * 0.30 +
      workerHealth     * 0.20 +
      analyticsHealth  * 0.10,
    );

    return {
      automationHealth,
      campaignHealth,
      publicationHealth,
      workerHealth,
      analyticsHealth,
      overallScore,
    };
  }

  /**
   * Builds a high-level summary for the top of the Operations Center dashboard.
   */
  public buildSummary(): OperationsSummaryDto {
    const health = this.calculateHealth();

    return {
      runningCampaigns: 3,         // TODO: query CampaignRepository
      queuedPublications: 12,      // TODO: query Queue length
      publishingJobs: 2,           // TODO: query Worker running jobs
      completedToday: 47,          // TODO: query Publication history
      automationExecutions: 7,     // TODO: query ExecutionContext store
      connectedSocialAccounts: 5,  // TODO: query OAuth token store
      connectedWorkers: this.getConnectedWorkerCount(),
      todayReach: 42_500,          // TODO: query Analytics engine
      todayEngagement: 3_280,
      todayGrowth: 4.2,
      businessScore: health.overallScore,
      calculatedAt: new Date(),
    };
  }

  // ─── Private Health Sensors ──────────────────────────────────────────────────

  private measureWorkerHealth(): number {
    const connectedCount = this.getConnectedWorkerCount();
    if (connectedCount === 0) return 0;
    // A crude health score — more workers = healthier (capped at 100)
    return Math.min(100, connectedCount * 25);
  }

  private measureAutomationHealth(): number {
    // TODO: Base on failure rate of ExecutionStateMachine
    return 90;
  }

  private measureCampaignHealth(): number {
    // TODO: Base on Campaign completion rates
    return 85;
  }

  private measurePublicationHealth(): number {
    // TODO: Base on Publication failure rate
    return 95;
  }

  private measureAnalyticsHealth(): number {
    // TODO: Base on Analytics last update time
    return 100;
  }

  private getConnectedWorkerCount(): number {
    return this.workerRegistry.getAllActiveWorkers().length;
  }
}
