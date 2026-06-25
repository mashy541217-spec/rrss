import { ValueObject } from '@rrss-auto/domain';

interface CredentialIdProps {
  value: string;
}

export class CredentialId extends ValueObject<CredentialIdProps> {
  private constructor(props: CredentialIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): CredentialId {
    if (!value || value.trim().length === 0) {
      throw new Error('Credential ID cannot be empty');
    }
    return new CredentialId({ value });
  }
}
