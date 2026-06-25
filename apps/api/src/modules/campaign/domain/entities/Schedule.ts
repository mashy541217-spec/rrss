import { Entity } from '@rrss-auto/domain';
import { CampaignPeriod } from '../value-objects/CampaignPeriod';

export interface ScheduleProps {
  period: CampaignPeriod;
  cron?: string;
  timezone: string;
  status: string;
}

export class Schedule extends Entity<ScheduleProps, any> {
  private constructor(props: ScheduleProps, id: string) { super(props, id); }
  get period(): CampaignPeriod { return this.props.period; }
  get cron(): string | undefined { return this.props.cron; }
  get timezone(): string { return this.props.timezone; }
  get status(): string { return this.props.status; }

  public static create(props: ScheduleProps, id: string): Schedule {
    return new Schedule(props, id);
  }
}