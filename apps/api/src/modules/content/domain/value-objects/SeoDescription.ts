import { ValueObject } from '@rrss-auto/domain';

const MAX_SEO_DESC_LENGTH = 160;

interface SeoDescriptionProps { value: string; }

export class SeoDescription extends ValueObject<SeoDescriptionProps> {
  private constructor(props: SeoDescriptionProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): SeoDescription {
    if (value.length > MAX_SEO_DESC_LENGTH) throw new Error(`SeoDescription exceeds max length of ${MAX_SEO_DESC_LENGTH}`);
    return new SeoDescription({ value });
  }
  public static empty(): SeoDescription { return new SeoDescription({ value: '' }); }
}
