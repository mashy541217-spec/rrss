import { ValueObject } from '@rrss-auto/domain';

const MAX_CAPTION_LENGTH = 2200; // Instagram max

interface CaptionProps { value: string; }

export class Caption extends ValueObject<CaptionProps> {
  private constructor(props: CaptionProps) { super(props); }
  get value(): string { return this.props.value; }
  get length(): number { return this.props.value.length; }
  public static create(value: string): Caption {
    if (value.length > MAX_CAPTION_LENGTH) throw new Error(`Caption exceeds max length of ${MAX_CAPTION_LENGTH}`);
    return new Caption({ value });
  }
  public static empty(): Caption { return new Caption({ value: '' }); }
}
