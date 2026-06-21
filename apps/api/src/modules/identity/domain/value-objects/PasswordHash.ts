import { ValueObject } from '@rrss-auto/domain';
import { InvalidPasswordHashException } from '../exceptions/InvalidPasswordHashException';

export interface PasswordHashProps {
  value: string;
}

/**
 * Opaque wrapper for a hashed credential.
 *
 * Never stores plain text. The hash is produced by the infrastructure layer
 * (bcrypt, argon2, etc.) before being passed to the domain.
 *
 * The domain treats this as an opaque token – it NEVER hashes or compares raw passwords.
 */
export class PasswordHash extends ValueObject<PasswordHashProps> {
  private constructor(props: PasswordHashProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(hash: string): PasswordHash {
    if (!hash || hash.trim().length === 0) {
      throw new InvalidPasswordHashException('Password hash cannot be empty');
    }
    return new PasswordHash({ value: hash.trim() });
  }
}
