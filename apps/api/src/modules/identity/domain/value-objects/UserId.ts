import { ValueObject } from '@rrss-auto/domain';
import { InvalidUserIdException } from '../exceptions/InvalidUserIdException';

export interface UserIdProps {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> {
  private constructor(props: UserIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new InvalidUserIdException('User ID cannot be empty');
    }
    return new UserId({ value: value.trim() });
  }
}
