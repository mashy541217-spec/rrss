import { Specification } from '@rrss-auto/domain';
import { Execution } from '../aggregates/Execution';

export class ExecutionIsTerminalSpecification implements Specification<Execution> {
  public isSatisfiedBy(execution: Execution): boolean {
    return execution.isTerminal;
  }
}
