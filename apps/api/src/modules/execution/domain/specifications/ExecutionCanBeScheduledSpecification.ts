import { Specification } from '@rrss-auto/domain';
import { Execution } from '../aggregates/Execution';
import { ExecutionStatus } from '../enums/ExecutionStatus';

export class ExecutionCanBeScheduledSpecification implements Specification<Execution> {
  public isSatisfiedBy(execution: Execution): boolean {
    return (
      execution.status === ExecutionStatus.Planned ||
      execution.status === ExecutionStatus.Retrying
    ) && execution.totalSteps > 0;
  }
}
