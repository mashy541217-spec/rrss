import { ValueObject } from '@rrss-auto/domain';

interface EncryptedSecretProps {
  value: string;
}

export class EncryptedSecret extends ValueObject<EncryptedSecretProps> {
  public get value(): string {
    return this.props.value;
  }

  public static create(value: string): EncryptedSecret {
    if (!value || value.trim().length === 0) {
      throw new Error('Encrypted secret cannot be empty');
    }
    return new EncryptedSecret({ value });
  }
}
