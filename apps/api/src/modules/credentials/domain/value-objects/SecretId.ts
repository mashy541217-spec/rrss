import { ValueObject } from '@rrss-auto/domain';

interface SecretIdProps {
  value: string;
}

export class SecretId extends ValueObject<SecretIdProps> {
  private constructor(props: SecretIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): SecretId {
    if (!value || value.trim().length === 0) {
      throw new Error('Secret ID cannot be empty');
    }
    return new SecretId({ value });
  }
}
