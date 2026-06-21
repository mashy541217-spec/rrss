import { Specification } from '@rrss-auto/domain';
import { Execution } from '../aggregates/Execution';

export class ExecutionCanRetrySpecification implements Specification<Execution> {
  public isSatisfiedBy(execution: Execution): boolean {
    if (!execution.failure) return false;
    if (!execution.failure.isRecoverable) return false;
    return execution.retryPolicy.allowsMoreAttempts(execution.attemptsMade);
  }
}
