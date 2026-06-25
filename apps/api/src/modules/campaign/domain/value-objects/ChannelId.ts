import { ValueObject } from '@rrss-auto/domain';
interface ChannelIdProps { value: string; }
export class ChannelId extends ValueObject<ChannelIdProps> {
  private constructor(props: ChannelIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): ChannelId {
    if (!value || value.trim().length === 0) throw new Error('ChannelId cannot be empty');
    return new ChannelId({ value });
  }
}