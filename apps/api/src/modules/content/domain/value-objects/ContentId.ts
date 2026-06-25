import { ValueObject } from '@rrss-auto/domain';

interface ContentIdProps { value: string; }

export class ContentId extends ValueObject<ContentIdProps> {
  private constructor(props: ContentIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): ContentId {
    if (!value || value.trim().length === 0) throw new Error('ContentId cannot be empty');
    return new ContentId({ value });
  }
}
