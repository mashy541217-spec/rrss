import { ValueObject } from '@rrss-auto/domain';

/**
 * RetryPolicy – immutable retry configuration owned by an Execution.
 *
 * RFC-0001: retries must be policies, not automatic reflexes.
 * Parameters: maxAttempts, baseBackoffMs, maxBackoffMs, jitterMs, retryWindow.
 */
export interface RetryPolicyProps {
  maxAttempts: number;
  baseBackoffMs: number;
  maxBackoffMs: number;
  jitterMs: number;
  /** Max time window (ms) within which retries are allowed. 0 = no window limit. */
  retryWindowMs: number;
}

export class RetryPolicy extends ValueObject<RetryPolicyProps> {
  public static readonly DEFAULT = new RetryPolicy({
    maxAttempts: 3,
    baseBackoffMs: 1_000,
    maxBackoffMs: 30_000,
    jitterMs: 500,
    retryWindowMs: 0,
  });

  public static readonly NO_RETRY = new RetryPolicy({
    maxAttempts: 1,
    baseBackoffMs: 0,
    maxBackoffMs: 0,
    jitterMs: 0,
    retryWindowMs: 0,
  });

  private constructor(props: RetryPolicyProps) { super(props); }

  get maxAttempts(): number { return this.props.maxAttempts; }
  get baseBackoffMs(): number { return this.props.baseBackoffMs; }
  get maxBackoffMs(): number { return this.props.maxBackoffMs; }
  get jitterMs(): number { return this.props.jitterMs; }
  get retryWindowMs(): number { return this.props.retryWindowMs; }

  public static create(props: RetryPolicyProps): RetryPolicy {
    if (props.maxAttempts < 1) {
      throw new Error('RetryPolicy maxAttempts must be at least 1');
    }
    if (props.baseBackoffMs < 0 || props.maxBackoffMs < 0 || props.jitterMs < 0) {
      throw new Error('RetryPolicy backoff/jitter values cannot be negative');
    }
    return new RetryPolicy(props);
  }

  /**
   * Compute next backoff delay (exponential + jitter) for a given attempt number (1-based).
   */
  public computeBackoffMs(attempt: number): number {
    const exponential = Math.min(
      this.props.baseBackoffMs * Math.pow(2, attempt - 1),
      this.props.maxBackoffMs,
    );
    const jitter = Math.random() * this.props.jitterMs;
    return Math.floor(exponential + jitter);
  }

  public allowsMoreAttempts(attemptsMade: number): boolean {
    return attemptsMade < this.props.maxAttempts;
  }
}
