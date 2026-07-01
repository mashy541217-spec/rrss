import { Controller, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { OrchestrateCampaignUseCase } from '../application/use-cases/OrchestrateCampaignUseCase';
import { CampaignOrchestratorService } from '../application/services/CampaignOrchestratorService';
// Mock Campaign for now, would fetch from repo
import { Campaign } from '../../campaign/domain/aggregate/Campaign';

@Controller('campaigns')
export class CampaignOrchestratorController {
  constructor(
    private readonly orchestrateUseCase: OrchestrateCampaignUseCase,
    private readonly orchestratorService: CampaignOrchestratorService,
  ) {}

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  async startCampaign(@Param('id') id: string) {
    // Mock fetching campaign
    // const campaign = await this.campaignRepo.findById(id);
    // return this.orchestrateUseCase.execute(campaign);
    return { success: true, message: `Campaign ${id} orchestration started.` };
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  async pauseCampaign(@Param('id') id: string) {
    return { success: true, message: `Campaign ${id} paused.` };
  }

  @Post('bulk/start')
  @HttpCode(HttpStatus.OK)
  async startBulkCampaigns() {
    return { success: true, message: `Bulk campaigns started.` };
  }
}
