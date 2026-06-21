import { ValueObject } from '@rrss-auto/domain';
import { InvalidInvitationIdException } from '../exceptions/InvalidInvitationIdException';

export interface InvitationIdProps {
  value: string;
}

export class InvitationId extends ValueObject<InvitationIdProps> {
  private constructor(props: InvitationIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): InvitationId {
    if (!value || value.trim().length === 0) {
      throw new InvalidInvitationIdException('Invitation ID cannot be empty');
    }
    return new InvitationId({ value: value.trim() });
  }
}
