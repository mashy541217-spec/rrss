import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { CompleteCampaignCommand } from './CompleteCampaignCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';

@Injectable()
@CommandHandler(CompleteCampaignCommand)
export class CompleteCampaignUseCase implements IUseCase<CompleteCampaignCommand, void>, ICommandHandler<CompleteCampaignCommand, void> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: CompleteCampaignCommand): Promise<void> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    campaign.complete();

    await this.repository.save(campaign);
    await this.eventBus.publishAll(campaign.domainEvents);
    campaign.clearDomainEvents();
  }
}