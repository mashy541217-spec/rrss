import { ValueObject } from '@rrss-auto/domain';

export interface RetryBackoffProps {
  initialDelayMs: number;
  maxDelayMs: number;
  multiplier: number;
}

export class RetryBackoff extends ValueObject<RetryBackoffProps> {
  public static readonly DEFAULT = new RetryBackoff({ initialDelayMs: 1000, maxDelayMs: 60000, multiplier: 2 });

  private constructor(props: RetryBackoffProps) {
    super(props);
  }

  get initialDelayMs(): number { return this.props.initialDelayMs; }
  get maxDelayMs(): number { return this.props.maxDelayMs; }
  get multiplier(): number { return this.props.multiplier; }

  public static create(props: RetryBackoffProps): RetryBackoff {
    if (props.initialDelayMs < 0 || props.maxDelayMs < props.initialDelayMs || props.multiplier < 1) {
      throw new Error('Invalid RetryBackoff configuration');
    }
    return new RetryBackoff(props);
  }

  public calculateDelay(attempt: number): number {
    if (attempt <= 1) return this.initialDelayMs;
    const delay = this.initialDelayMs * Math.pow(this.multiplier, attempt - 1);
    return Math.min(delay, this.maxDelayMs);
  }
}
