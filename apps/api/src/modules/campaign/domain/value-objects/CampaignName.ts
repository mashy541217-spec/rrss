import { ValueObject } from '@rrss-auto/domain';
interface CampaignNameProps { value: string; }
export class CampaignName extends ValueObject<CampaignNameProps> {
  private constructor(props: CampaignNameProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): CampaignName {
    if (!value || value.trim().length === 0) throw new Error('CampaignName cannot be empty');
    return new CampaignName({ value });
  }
}