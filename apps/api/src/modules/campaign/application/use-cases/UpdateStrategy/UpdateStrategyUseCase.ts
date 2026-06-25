import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase } from '@rrss-auto/application';
import { UpdateStrategyCommand } from './UpdateStrategyCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';

@Injectable()
@CommandHandler(UpdateStrategyCommand)
export class UpdateStrategyUseCase implements IUseCase<UpdateStrategyCommand, void>, ICommandHandler<UpdateStrategyCommand, void> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository
  ) {}

  public async execute(command: UpdateStrategyCommand): Promise<void> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    campaign.updateStrategy(command.strategy);

    await this.repository.save(campaign);
  }
}