import { RetryPolicy } from '../value-objects/RetryPolicy';
import { FailureClassification } from '../value-objects/FailureClassification';

export class RetryPolicyEvaluator {
  /**
   * Evaluates if an execution can be retried based on its failure and policy.
   * Pure domain service.
   */
  public static canRetry(
    policy: RetryPolicy,
    failure: FailureClassification,
    attemptsMade: number
  ): boolean {
    if (!failure.isRecoverable) return false;
    return policy.allowsMoreAttempts(attemptsMade);
  }

  /**
   * Computes the wait time before the next attempt.
   */
  public static computeNextBackoffMs(
    policy: RetryPolicy,
    attemptsMade: number
  ): number {
    return policy.computeBackoffMs(attemptsMade + 1);
  }
}
