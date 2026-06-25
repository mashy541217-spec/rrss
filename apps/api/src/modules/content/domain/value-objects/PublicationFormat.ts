import { ValueObject } from '@rrss-auto/domain';

interface PublicationFormatProps { value: string; }

export class PublicationFormat extends ValueObject<PublicationFormatProps> {
  private constructor(props: PublicationFormatProps) { super(props); }
  get value(): string { return this.props.value; }
  // Platform-agnostic format identifiers (e.g. "SQUARE_IMAGE", "PORTRAIT_VIDEO_9_16", "STORY", "REEL")
  public static create(value: string): PublicationFormat {
    if (!value || value.trim().length === 0) throw new Error('PublicationFormat cannot be empty');
    return new PublicationFormat({ value: value.trim().toUpperCase() });
  }
}
