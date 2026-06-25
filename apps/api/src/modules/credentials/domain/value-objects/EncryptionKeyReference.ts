import { ValueObject } from '@rrss-auto/domain';

interface EncryptionKeyReferenceProps {
  keyId: string;
}

export class EncryptionKeyReference extends ValueObject<EncryptionKeyReferenceProps> {
  public get keyId(): string {
    return this.props.keyId;
  }

  public static create(keyId: string): EncryptionKeyReference {
    return new EncryptionKeyReference({ keyId });
  }
}
