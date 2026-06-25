import { ValueObject } from '@rrss-auto/domain';
interface PublicationIdProps { value: string; }
export class PublicationId extends ValueObject<PublicationIdProps> {
  private constructor(props: PublicationIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): PublicationId {
    if (!value || value.trim().length === 0) throw new Error('PublicationId cannot be empty');
    return new PublicationId({ value });
  }
}