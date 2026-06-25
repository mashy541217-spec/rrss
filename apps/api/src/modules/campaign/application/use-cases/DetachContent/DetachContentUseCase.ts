import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase } from '@rrss-auto/application';
import { DetachContentCommand } from './DetachContentCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';

@Injectable()
@CommandHandler(DetachContentCommand)
export class DetachContentUseCase implements IUseCase<DetachContentCommand, void>, ICommandHandler<DetachContentCommand, void> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository
  ) {}

  public async execute(command: DetachContentCommand): Promise<void> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    campaign.detachContent(command.contentId);

    await this.repository.save(campaign);
  }
}