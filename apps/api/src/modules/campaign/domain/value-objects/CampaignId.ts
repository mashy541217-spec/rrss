import { ValueObject } from '@rrss-auto/domain';
interface CampaignIdProps { value: string; }
export class CampaignId extends ValueObject<CampaignIdProps> {
  private constructor(props: CampaignIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): CampaignId {
    if (!value || value.trim().length === 0) throw new Error('CampaignId cannot be empty');
    return new CampaignId({ value });
  }
}