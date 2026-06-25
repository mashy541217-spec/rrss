import { ValueObject } from '@rrss-auto/domain';
import { PublicationStatus as PublicationStatusEnum } from '../enums/PublicationStatus';
interface PublicationStatusProps { value: PublicationStatusEnum; }
export class PublicationStatus extends ValueObject<PublicationStatusProps> {
  private constructor(props: PublicationStatusProps) { super(props); }
  get value(): PublicationStatusEnum { return this.props.value; }
  public static create(value: PublicationStatusEnum): PublicationStatus {
    return new PublicationStatus({ value });
  }
}