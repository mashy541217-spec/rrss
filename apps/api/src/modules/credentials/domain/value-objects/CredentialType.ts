import { ValueObject } from '@rrss-auto/domain';

interface CredentialTypeProps {
  value: string;
}

export class CredentialType extends ValueObject<CredentialTypeProps> {
  public get value(): string {
    return this.props.value;
  }

  public static create(type: string): CredentialType {
    if (!type || type.trim().length === 0) {
      throw new Error('Credential type cannot be empty');
    }
    return new CredentialType({ value: type });
  }
}
