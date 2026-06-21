import { Execution } from '../aggregates/Execution';
import { ExecutionStatus } from '../enums/ExecutionStatus';
import { InvalidExecutionTransitionException } from '../exceptions/InvalidExecutionTransitionException';

export class ExecutionStateGuard {
  /**
   * Validates if a transition is allowed based on RFC-0001 rules.
   * Can be used to check valid next states without modifying the aggregate.
   */
  public static canTransitionTo(execution: Execution, to: ExecutionStatus): boolean {
    const from = execution.status;
    if (execution.isTerminal) return false;

    switch (to) {
      case ExecutionStatus.Accepted: return from === ExecutionStatus.Requested;
      case ExecutionStatus.Rejected: return from === ExecutionStatus.Requested;
      case ExecutionStatus.Planned: return from === ExecutionStatus.Accepted;
      case ExecutionStatus.Scheduled: return from === ExecutionStatus.Planned || from === ExecutionStatus.Retrying;
      case ExecutionStatus.Queued:
        return from === ExecutionStatus.Scheduled || from === ExecutionStatus.WaitingForResources || from === ExecutionStatus.WaitingExternal;
      case ExecutionStatus.LeasingResources: return from === ExecutionStatus.Queued;
      case ExecutionStatus.WaitingForResources: return from === ExecutionStatus.Queued || from === ExecutionStatus.LeasingResources;
      case ExecutionStatus.Running: return from === ExecutionStatus.Queued || from === ExecutionStatus.LeasingResources;
      case ExecutionStatus.WaitingExternal: return from === ExecutionStatus.Running;
      case ExecutionStatus.Retrying: return from === ExecutionStatus.Running; // Failure -> Retrying logic
      case ExecutionStatus.Completed: return from === ExecutionStatus.Running;
      case ExecutionStatus.Failed: return from === ExecutionStatus.Running;
      case ExecutionStatus.Cancelled: return !execution.isTerminal;
      case ExecutionStatus.Archived:
        return from === ExecutionStatus.Completed || from === ExecutionStatus.Failed || from === ExecutionStatus.Cancelled;
      default:
        return false;
    }
  }

  public static assertCanTransition(execution: Execution, to: ExecutionStatus): void {
    if (!this.canTransitionTo(execution, to)) {
      throw new InvalidExecutionTransitionException(
        `Invalid transition from '${execution.status}' to '${to}' for Execution '${execution.id.value}'`
      );
    }
  }
}
