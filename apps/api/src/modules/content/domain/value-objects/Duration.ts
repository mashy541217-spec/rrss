import { ValueObject } from '@rrss-auto/domain';

// Duration in seconds
interface DurationProps { seconds: number; }

export class Duration extends ValueObject<DurationProps> {
  private constructor(props: DurationProps) { super(props); }
  get seconds(): number { return this.props.seconds; }
  get milliseconds(): number { return this.props.seconds * 1000; }
  public static create(seconds: number): Duration {
    if (seconds < 0) throw new Error('Duration must be non-negative');
    return new Duration({ seconds });
  }
  toString(): string {
    const h = Math.floor(this.seconds / 3600);
    const m = Math.floor((this.seconds % 3600) / 60);
    const s = this.seconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
  }
}
