import { ValueObject } from '@rrss-auto/domain';

const MAX_ALT_LENGTH = 500;

interface AltTextProps { value: string; }

export class AltText extends ValueObject<AltTextProps> {
  private constructor(props: AltTextProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): AltText {
    if (value.length > MAX_ALT_LENGTH) throw new Error(`AltText exceeds max length of ${MAX_ALT_LENGTH}`);
    return new AltText({ value });
  }
  public static empty(): AltText { return new AltText({ value: '' }); }
}
