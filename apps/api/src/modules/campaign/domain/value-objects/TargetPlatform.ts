import { ValueObject } from '@rrss-auto/domain';
interface TargetPlatformProps { value: string; }
export class TargetPlatform extends ValueObject<TargetPlatformProps> {
  private constructor(props: TargetPlatformProps) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): TargetPlatform {
    if (!value || value.trim().length === 0) throw new Error('TargetPlatform cannot be empty');
    return new TargetPlatform({ value });
  }
}