import { ValueObject } from '@rrss-auto/domain';
import { InvalidDisplayNameException } from '../exceptions/InvalidDisplayNameException';

export interface DisplayNameProps {
  value: string;
}

export class DisplayName extends ValueObject<DisplayNameProps> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 100;

  private constructor(props: DisplayNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): DisplayName {
    if (!value || value.trim().length === 0) {
      throw new InvalidDisplayNameException('Display name cannot be empty');
    }

    const trimmed = value.trim();

    if (trimmed.length < DisplayName.MIN_LENGTH || trimmed.length > DisplayName.MAX_LENGTH) {
      throw new InvalidDisplayNameException(
        `Display name must be between ${DisplayName.MIN_LENGTH} and ${DisplayName.MAX_LENGTH} characters`,
      );
    }

    return new DisplayName({ value: trimmed });
  }
}
