import { ValueObject } from '@rrss-auto/domain';
import { CampaignObjective as CampaignObjectiveEnum } from '../enums/CampaignObjective';
interface CampaignObjectiveProps { value: CampaignObjectiveEnum; }
export class CampaignObjective extends ValueObject<CampaignObjectiveProps> {
  private constructor(props: CampaignObjectiveProps) { super(props); }
  get value(): CampaignObjectiveEnum { return this.props.value; }
  public static create(value: CampaignObjectiveEnum): CampaignObjective {
    return new CampaignObjective({ value });
  }
}