import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { AddChannelCommand } from './AddChannelCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';

@Injectable()
@CommandHandler(AddChannelCommand)
export class AddChannelUseCase implements IUseCase<AddChannelCommand, string>, ICommandHandler<AddChannelCommand, string> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus,
    @Inject('IIdentifierProvider') private readonly idProvider: IIdentifierProvider
  ) {}

  public async execute(command: AddChannelCommand): Promise<string> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    const channelId = this.idProvider.nextId();
    campaign.addChannel(channelId, command.platform, command.type, command.configuration);

    await this.repository.save(campaign);
    await this.eventBus.publishAll(campaign.domainEvents);
    campaign.clearDomainEvents();

    return channelId;
  }
}