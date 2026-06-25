import { ValueObject } from '@rrss-auto/domain';
interface CampaignPeriodProps { startDate: Date; endDate?: Date; }
export class CampaignPeriod extends ValueObject<CampaignPeriodProps> {
  private constructor(props: CampaignPeriodProps) { super(props); }
  get startDate(): Date { return this.props.startDate; }
  get endDate(): Date | undefined { return this.props.endDate; }
  public static create(startDate: Date, endDate?: Date): CampaignPeriod {
    if (endDate && endDate < startDate) throw new Error('EndDate cannot be before StartDate');
    return new CampaignPeriod({ startDate, endDate });
  }
}