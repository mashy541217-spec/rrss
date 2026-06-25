import { ValueObject } from '@rrss-auto/domain';
interface TimeoutProps { value: number; unit: 'SECONDS' | 'MINUTES' | 'HOURS'; }
export class Timeout extends ValueObject<TimeoutProps> {
  private constructor(props: TimeoutProps) { super(props); }
  get value(): number { return this.props.value; }
  get unit(): 'SECONDS' | 'MINUTES' | 'HOURS' { return this.props.unit; }
  public static create(value: number, unit: 'SECONDS' | 'MINUTES' | 'HOURS'): Timeout {
    if (value < 0) throw new Error('Timeout value cannot be negative');
    return new Timeout({ value, unit });
  }
}
