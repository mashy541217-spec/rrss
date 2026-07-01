import { Controller, Get, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { OperationsFeedService } from '../application/OperationsFeedService';
import { AlertService } from '../application/AlertService';
import { BusinessHealthAggregator } from '../application/BusinessHealthAggregator';

/**
 * Operations Control Center API
 * All reads go through this controller. WebSocket events are emitted
 * by the individual services whenever state changes.
 */
@Controller('operations')
export class OperationsController {

  constructor(
    private readonly feedService: OperationsFeedService,
    private readonly alertService: AlertService,
    private readonly healthAggregator: BusinessHealthAggregator,
  ) {}

  /** Top-level summary card data for the Operations Center header */
  @Get('summary')
  @HttpCode(HttpStatus.OK)
  getSummary() {
    return { success: true, data: this.healthAggregator.buildSummary() };
  }

  /** Business Health breakdown */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return { success: true, data: this.healthAggregator.calculateHealth() };
  }

  /** Live activity feed (last 50 entries) */
  @Get('activity')
  @HttpCode(HttpStatus.OK)
  getActivity() {
    return { success: true, data: this.feedService.getRecentActivities(50) };
  }

  /** Unacknowledged alerts sorted by severity */
  @Get('alerts')
  @HttpCode(HttpStatus.OK)
  getAlerts() {
    return { success: true, data: this.alertService.getActiveAlerts() };
  }

  /** Acknowledge a specific alert */
  @Post('alerts/:id/acknowledge')
  @HttpCode(HttpStatus.OK)
  acknowledgeAlert(@Param('id') id: string) {
    const result = this.alertService.acknowledge(id);
    return { success: result };
  }

  /**
   * Campaign monitor — enriched campaign list with real-time fields.
   * In production, this queries CampaignRepository and joins Analytics data.
   */
  @Get('campaigns')
  @HttpCode(HttpStatus.OK)
  getCampaigns() {
    return {
      success: true,
      data: [
        { id: 'camp_01', name: 'Summer Launch', status: 'Running', progress: 68, reach: 18_200, publications: 5, healthScore: 87 },
        { id: 'camp_02', name: 'Product Reveal', status: 'Queued',  progress: 0,  reach: 0,      publications: 3, healthScore: 100 },
        { id: 'camp_03', name: 'Black Friday',   status: 'Completed', progress: 100, reach: 42_500, publications: 12, healthScore: 92 },
      ],
    };
  }

  /**
   * Worker monitor — proxies WorkerRegistryService data.
   */
  @Get('workers')
  @HttpCode(HttpStatus.OK)
  getWorkers() {
    return {
      success: true,
      data: [
        { id: 'wkr_01', status: 'Busy', cpu: 42, ram: 310, latency: 12, capabilities: ['Instagram', 'Facebook'], jobs: 2 },
        { id: 'wkr_02', status: 'Idle', cpu: 5,  ram: 180, latency: 8,  capabilities: ['Playwright', 'Chromium'], jobs: 0 },
      ],
    };
  }
}
