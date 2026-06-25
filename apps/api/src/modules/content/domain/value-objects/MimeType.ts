import { ValueObject } from '@rrss-auto/domain';

// e.g. "image/jpeg", "video/mp4", "audio/mpeg", "application/pdf"
interface MimeTypeProps { value: string; }

const ALLOWED_PATTERN = /^[\w]+\/[\w.+\-]+$/;

export class MimeType extends ValueObject<MimeTypeProps> {
  private constructor(props: MimeTypeProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): MimeType {
    if (!value || !ALLOWED_PATTERN.test(value)) throw new Error(`Invalid MIME type: ${value}`);
    return new MimeType({ value });
  }
  get category(): string { return this.props.value.split('/')[0]; }
  get subtype(): string { return this.props.value.split('/')[1]; }
}
