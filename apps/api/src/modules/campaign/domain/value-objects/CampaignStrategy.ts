import { ValueObject } from '@rrss-auto/domain';
import { PublicationStrategy } from '../enums/PublicationStrategy';
interface CampaignStrategyProps { value: PublicationStrategy; }
export class CampaignStrategy extends ValueObject<CampaignStrategyProps> {
  private constructor(props: CampaignStrategyProps) { super(props); }
  get value(): PublicationStrategy { return this.props.value; }
  public static create(value: PublicationStrategy): CampaignStrategy {
    return new CampaignStrategy({ value });
  }
}