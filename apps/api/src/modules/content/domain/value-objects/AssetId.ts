import { ValueObject } from '@rrss-auto/domain';

interface AssetIdProps { value: string; }

export class AssetId extends ValueObject<AssetIdProps> {
  private constructor(props: AssetIdProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): AssetId {
    if (!value || value.trim().length === 0) throw new Error('AssetId cannot be empty');
    return new AssetId({ value });
  }
}
