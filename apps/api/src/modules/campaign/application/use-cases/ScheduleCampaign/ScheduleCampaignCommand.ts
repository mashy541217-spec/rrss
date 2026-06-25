import { ICommand } from '@rrss-auto/application';
export class ScheduleCampaignCommand implements ICommand {
  constructor(
    public readonly campaignId: string,
    public readonly startDate: Date,
    public readonly endDate?: Date,
    public readonly cron?: string,
    public readonly timezone?: string
  ) {}
}