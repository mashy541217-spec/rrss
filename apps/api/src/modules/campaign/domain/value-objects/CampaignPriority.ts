import { ValueObject } from '@rrss-auto/domain';
import { CampaignPriority as CampaignPriorityEnum } from '../enums/CampaignPriority';
interface CampaignPriorityProps { value: CampaignPriorityEnum; }
export class CampaignPriority extends ValueObject<CampaignPriorityProps> {
  private constructor(props: CampaignPriorityProps) { super(props); }
  get value(): CampaignPriorityEnum { return this.props.value; }
  public static create(value: CampaignPriorityEnum): CampaignPriority {
    return new CampaignPriority({ value });
  }
}