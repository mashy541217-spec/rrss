import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { AttachContentCommand } from './AttachContentCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';

@Injectable()
@CommandHandler(AttachContentCommand)
export class AttachContentUseCase implements IUseCase<AttachContentCommand, void>, ICommandHandler<AttachContentCommand, void> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: AttachContentCommand): Promise<void> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    campaign.attachContent(command.contentId, command.attachedBy);

    await this.repository.save(campaign);
    await this.eventBus.publishAll(campaign.domainEvents);
    campaign.clearDomainEvents();
  }
}