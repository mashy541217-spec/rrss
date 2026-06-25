import { ValueObject } from '@rrss-auto/domain';

interface CredentialNameProps {
  value: string;
}

export class CredentialName extends ValueObject<CredentialNameProps> {
  public get value(): string {
    return this.props.value;
  }

  public static create(name: string): CredentialName {
    if (!name || name.trim().length === 0) {
      throw new Error('Credential name cannot be empty');
    }
    return new CredentialName({ value: name });
  }
}
