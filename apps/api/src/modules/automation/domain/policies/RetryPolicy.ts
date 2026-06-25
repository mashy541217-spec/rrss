import { RetryPolicy as RetryPolicyVO } from '../value-objects/RetryPolicy';

export class RetryPolicy {
  public static validate(policy: RetryPolicyVO): boolean {
    return policy.attempts >= 0 && policy.delay >= 0;
  }
}
