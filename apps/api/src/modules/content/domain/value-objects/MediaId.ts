import { ValueObject } from '@rrss-auto/domain';

interface MediaIdProps { value: string; }

export class MediaId extends ValueObject<MediaIdProps> {
  private constructor(props: MediaIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): MediaId {
    if (!value || value.trim().length === 0) throw new Error('MediaId cannot be empty');
    return new MediaId({ value });
  }
}
