import { ValueObject } from '@rrss-auto/domain';

// SHA-256 hex checksum
interface ChecksumProps { value: string; algorithm: string; }

export class Checksum extends ValueObject<ChecksumProps> {
  private constructor(props: ChecksumProps) { super(props); }
  get value(): string { return this.props.value; }
  get algorithm(): string { return this.props.algorithm; }
  public static create(value: string, algorithm = 'sha256'): Checksum {
    if (!value || value.trim().length === 0) throw new Error('Checksum cannot be empty');
    return new Checksum({ value: value.trim().toLowerCase(), algorithm });
  }
}
