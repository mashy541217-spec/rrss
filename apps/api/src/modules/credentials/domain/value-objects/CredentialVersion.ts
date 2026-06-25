import { ValueObject } from '@rrss-auto/domain';

interface CredentialVersionProps {
  value: number;
}

export class CredentialVersion extends ValueObject<CredentialVersionProps> {
  public get value(): number {
    return this.props.value;
  }

  public static create(version: number = 1): CredentialVersion {
    if (version < 1) {
      throw new Error('Credential version must be at least 1');
    }
    return new CredentialVersion({ value: version });
  }

  public increment(): CredentialVersion {
    return new CredentialVersion({ value: this.props.value + 1 });
  }
}
