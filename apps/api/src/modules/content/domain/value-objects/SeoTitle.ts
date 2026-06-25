import { ValueObject } from '@rrss-auto/domain';

const MAX_SEO_TITLE_LENGTH = 70;

interface SeoTitleProps { value: string; }

export class SeoTitle extends ValueObject<SeoTitleProps> {
  private constructor(props: SeoTitleProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): SeoTitle {
    if (value.length > MAX_SEO_TITLE_LENGTH) throw new Error(`SeoTitle exceeds max length of ${MAX_SEO_TITLE_LENGTH}`);
    return new SeoTitle({ value });
  }
  public static empty(): SeoTitle { return new SeoTitle({ value: '' }); }
}
