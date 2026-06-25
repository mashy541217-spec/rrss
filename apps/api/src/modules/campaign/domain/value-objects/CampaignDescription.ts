import { ValueObject } from '@rrss-auto/domain';
interface CampaignDescriptionProps { value?: string; }
export class CampaignDescription extends ValueObject<CampaignDescriptionProps> {
  private constructor(props: CampaignDescriptionProps) { super(props); }
  get value(): string | undefined { return this.props.value; }
  public static create(value?: string): CampaignDescription {
    return new CampaignDescription({ value });
  }
}