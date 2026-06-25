import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase } from '@rrss-auto/application';
import { RemoveChannelCommand } from './RemoveChannelCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';

@Injectable()
@CommandHandler(RemoveChannelCommand)
export class RemoveChannelUseCase implements IUseCase<RemoveChannelCommand, void>, ICommandHandler<RemoveChannelCommand, void> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository
  ) {}

  public async execute(command: RemoveChannelCommand): Promise<void> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    campaign.removeChannel(command.channelId);

    await this.repository.save(campaign);
  }
}