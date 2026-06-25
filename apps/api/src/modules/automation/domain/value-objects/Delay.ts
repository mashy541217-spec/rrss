import { ValueObject } from '@rrss-auto/domain';
interface DelayProps { value: number; unit: 'SECONDS' | 'MINUTES' | 'HOURS'; }
export class Delay extends ValueObject<DelayProps> {
  private constructor(props: DelayProps) { super(props); }
  get value(): number { return this.props.value; }
  get unit(): 'SECONDS' | 'MINUTES' | 'HOURS' { return this.props.unit; }
  public static create(value: number, unit: 'SECONDS' | 'MINUTES' | 'HOURS'): Delay {
    if (value < 0) throw new Error('Delay value cannot be negative');
    return new Delay({ value, unit });
  }
}
