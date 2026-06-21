import { ValueObject } from '@rrss-auto/domain';
import { InvalidMembershipIdException } from '../exceptions/InvalidMembershipIdException';

export interface MembershipIdProps {
  value: string;
}

export class MembershipId extends ValueObject<MembershipIdProps> {
  private constructor(props: MembershipIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): MembershipId {
    if (!value || value.trim().length === 0) {
      throw new InvalidMembershipIdException('Membership ID cannot be empty');
    }
    return new MembershipId({ value: value.trim() });
  }
}
