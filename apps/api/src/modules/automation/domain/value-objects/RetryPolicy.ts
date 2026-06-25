import { ValueObject } from '@rrss-auto/domain';
import { RetryStrategy } from '../enums/RetryStrategy';
interface RetryPolicyProps { strategy: RetryStrategy; attempts: number; delay: number; }
export class RetryPolicy extends ValueObject<RetryPolicyProps> {
  private constructor(props: RetryPolicyProps) { super(props); }
  get strategy(): RetryStrategy { return this.props.strategy; }
  get attempts(): number { return this.props.attempts; }
  get delay(): number { return this.props.delay; }
  public static create(strategy: RetryStrategy, attempts: number, delay: number): RetryPolicy {
    if (attempts < 0) throw new Error('Attempts cannot be negative');
    if (delay < 0) throw new Error('Delay cannot be negative');
    return new RetryPolicy({ strategy, attempts, delay });
  }
}
