import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { ScheduleCampaignCommand } from './ScheduleCampaignCommand';
import { ICampaignRepository } from '../../../domain/repositories/ICampaignRepository';
import { CampaignId } from '../../../domain/value-objects/CampaignId';
import { Schedule } from '../../../domain/entities/Schedule';
import { CampaignPeriod } from '../../../domain/value-objects/CampaignPeriod';

@Injectable()
@CommandHandler(ScheduleCampaignCommand)
export class ScheduleCampaignUseCase implements IUseCase<ScheduleCampaignCommand, void>, ICommandHandler<ScheduleCampaignCommand, void> {
  constructor(
    @Inject('ICampaignRepository') private readonly repository: ICampaignRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ScheduleCampaignCommand): Promise<void> {
    const campaign = await this.repository.findById(CampaignId.create(command.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    const period = CampaignPeriod.create(command.startDate, command.endDate);
    const schedule = Schedule.create({
      period,
      cron: command.cron,
      timezone: command.timezone || 'UTC',
      status: 'ACTIVE'
    }, campaign.id.value);

    campaign.updateSchedule(schedule);

    await this.repository.save(campaign);
    await this.eventBus.publishAll(campaign.domainEvents);
    campaign.clearDomainEvents();
  }
}