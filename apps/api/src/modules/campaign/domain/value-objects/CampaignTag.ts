import { ValueObject } from '@rrss-auto/domain';
interface CampaignTagProps { value: string; }
export class CampaignTag extends ValueObject<CampaignTagProps> {
  private constructor(props: CampaignTagProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): CampaignTag {
    if (!value || value.trim().length === 0) throw new Error('CampaignTag cannot be empty');
    return new CampaignTag({ value });
  }
}