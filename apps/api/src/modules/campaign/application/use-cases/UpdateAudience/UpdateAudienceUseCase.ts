import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase } from '@rrss-auto/application';
import { UpdateAudienceCommand } from './UpdateAudienceCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';
import { Audience } from '../../../domain/entities/Audience';
import { AudienceSegment } from '../../../domain/value-objects/AudienceSegment';

@Injectable()
@CommandHandler(UpdateAudienceCommand)
export class UpdateAudienceUseCase implements IUseCase<UpdateAudienceCommand, void>, ICommandHandler<UpdateAudienceCommand, void> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository
  ) {}

  public async execute(command: UpdateAudienceCommand): Promise<void> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    const audience = Audience.create({
      name: command.name,
      segments: command.segments.map(s => AudienceSegment.create(s)),
      rules: command.rules
    }, campaign.id.value);

    campaign.updateAudience(audience);

    await this.repository.save(campaign);
  }
}