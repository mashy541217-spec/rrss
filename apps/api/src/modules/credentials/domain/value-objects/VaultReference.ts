import { ValueObject } from '@rrss-auto/domain';

interface VaultReferenceProps {
  value: string;
}

export class VaultReference extends ValueObject<VaultReferenceProps> {
  public get value(): string {
    return this.props.value;
  }

  public static create(reference: string): VaultReference {
    return new VaultReference({ value: reference });
  }
}
