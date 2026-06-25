import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { ActivateCampaignCommand } from './ActivateCampaignCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';

@Injectable()
@CommandHandler(ActivateCampaignCommand)
export class ActivateCampaignUseCase implements IUseCase<ActivateCampaignCommand, void>, ICommandHandler<ActivateCampaignCommand, void> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ActivateCampaignCommand): Promise<void> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    campaign.activate();

    await this.repository.save(campaign);
    await this.eventBus.publishAll(campaign.domainEvents);
    campaign.clearDomainEvents();
  }
}