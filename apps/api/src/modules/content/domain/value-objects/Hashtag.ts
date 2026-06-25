import { ValueObject } from '@rrss-auto/domain';

interface HashtagProps { value: string; }

export class Hashtag extends ValueObject<HashtagProps> {
  private constructor(props: HashtagProps) { super(props); }
  get value(): string { return this.props.value; }
  get normalized(): string { return this.props.value.startsWith('#') ? this.props.value : `#${this.props.value}`; }
  public static create(value: string): Hashtag {
    const clean = value.trim().replace(/^#/, '');
    if (!clean || /\s/.test(clean)) throw new Error(`Invalid hashtag: ${value}`);
    return new Hashtag({ value: clean });
  }
}
