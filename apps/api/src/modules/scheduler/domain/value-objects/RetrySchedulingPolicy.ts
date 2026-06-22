import { ValueObject } from '@rrss-auto/domain';
import { RetryBackoff } from './RetryBackoff';

export interface RetrySchedulingPolicyProps {
  maxRetries: number;
  backoff: RetryBackoff;
}

export class RetrySchedulingPolicy extends ValueObject<RetrySchedulingPolicyProps> {
  private constructor(props: RetrySchedulingPolicyProps) {
    super(props);
  }

  get maxRetries(): number { return this.props.maxRetries; }
  get backoff(): RetryBackoff { return this.props.backoff; }

  public static create(maxRetries: number, backoff: RetryBackoff): RetrySchedulingPolicy {
    if (maxRetries < 0) throw new Error('Max retries cannot be negative');
    return new RetrySchedulingPolicy({ maxRetries, backoff });
  }

  public allowsRetry(attemptsMade: number): boolean {
    return attemptsMade < this.maxRetries;
  }
}
