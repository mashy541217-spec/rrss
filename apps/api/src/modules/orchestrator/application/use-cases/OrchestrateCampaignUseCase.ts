import { Injectable, Logger } from '@nestjs/common';
import { CampaignOrchestratorService } from '../services/CampaignOrchestratorService';
// In a real app we'd inject repositories here
import { Campaign } from '../../../campaign/domain/aggregate/Campaign';
import { PublicationGroup } from '../../../campaign/domain/entities/PublicationGroup';

@Injectable()
export class OrchestrateCampaignUseCase {
  private readonly logger = new Logger(OrchestrateCampaignUseCase.name);

  constructor(
    private readonly orchestratorService: CampaignOrchestratorService,
  ) {}

  public async execute(campaign: Campaign): Promise<PublicationGroup> {
    this.logger.log(`Executing OrchestrateCampaignUseCase for ${campaign.id.value}`);
    return this.orchestratorService.orchestrateCampaign(campaign);
  }
}
