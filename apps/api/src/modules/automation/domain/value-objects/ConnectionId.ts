import { ValueObject } from '@rrss-auto/domain';
interface ConnectionIdProps { value: string; }
export class ConnectionId extends ValueObject<ConnectionIdProps> {
  private constructor(props: ConnectionIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): ConnectionId {
    if (!value || value.trim().length === 0) throw new Error('ConnectionId cannot be empty');
    return new ConnectionId({ value });
  }
}
