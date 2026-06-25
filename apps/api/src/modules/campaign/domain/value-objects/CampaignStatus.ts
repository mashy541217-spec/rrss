import { ValueObject } from '@rrss-auto/domain';
import { CampaignState } from '../enums/CampaignState';
interface CampaignStatusProps { value: CampaignState; }
export class CampaignStatus extends ValueObject<CampaignStatusProps> {
  private constructor(props: CampaignStatusProps) { super(props); }
  get value(): CampaignState { return this.props.value; }
  public static create(value: CampaignState): CampaignStatus {
    return new CampaignStatus({ value });
  }
}