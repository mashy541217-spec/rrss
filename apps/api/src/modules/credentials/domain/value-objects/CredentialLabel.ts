import { ValueObject } from '@rrss-auto/domain';

interface CredentialLabelProps {
  key: string;
  value: string;
}

export class CredentialLabel extends ValueObject<CredentialLabelProps> {
  public get key(): string {
    return this.props.key;
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(key: string, value: string): CredentialLabel {
    if (!key || key.trim().length === 0) {
      throw new Error('Label key cannot be empty');
    }
    return new CredentialLabel({ key, value });
  }
}
