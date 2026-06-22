import { ISpecification } from './ISpecification';
import { WorkerStatus } from '../enums/WorkerStatus';
import { WorkerHealth } from '../enums/WorkerHealth';

export class WorkerCanAcceptExecutionSpecification implements ISpecification<{ status: WorkerStatus, health: WorkerHealth, currentExecutions: number, maxCapacity: number }> {
  isSatisfiedBy(candidate: { status: WorkerStatus, health: WorkerHealth, currentExecutions: number, maxCapacity: number }): boolean {
    if (candidate.health !== WorkerHealth.Healthy) return false;
    if (candidate.status !== WorkerStatus.Idle && candidate.status !== WorkerStatus.Busy) return false;
    return candidate.currentExecutions < candidate.maxCapacity;
  }
}
