import { ValueObject } from '@rrss-auto/domain';

// File size in bytes
interface FileSizeProps { bytes: bigint; }

export class FileSize extends ValueObject<FileSizeProps> {
  private constructor(props: FileSizeProps) { super(props); }
  get bytes(): bigint { return this.props.bytes; }
  get kilobytes(): number { return Number(this.props.bytes) / 1024; }
  get megabytes(): number { return Number(this.props.bytes) / (1024 * 1024); }
  public static create(bytes: bigint | number): FileSize {
    const b = typeof bytes === 'number' ? BigInt(bytes) : bytes;
    if (b < 0n) throw new Error('FileSize must be non-negative');
    return new FileSize({ bytes: b });
  }
  public static fromMegabytes(mb: number): FileSize {
    return FileSize.create(BigInt(Math.round(mb * 1024 * 1024)));
  }
}
