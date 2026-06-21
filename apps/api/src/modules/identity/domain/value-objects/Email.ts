import { ValueObject } from '@rrss-auto/domain';
import { InvalidEmailException } from '../exceptions/InvalidEmailException';

export interface EmailProps {
  value: string;
}

/**
 * Email value object.
 * Normalised to lowercase. Validated against RFC-5322 simplified pattern.
 */
export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new InvalidEmailException('Email cannot be empty');
    }

    const normalised = value.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(normalised)) {
      throw new InvalidEmailException(`'${normalised}' is not a valid email address`);
    }

    return new Email({ value: normalised });
  }
}
