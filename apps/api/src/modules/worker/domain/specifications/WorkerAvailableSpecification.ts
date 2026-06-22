import { ISpecification } from './ISpecification';
import { WorkerStatus } from '../enums/WorkerStatus';
import { WorkerHealth } from '../enums/WorkerHealth';

export class WorkerAvailableSpecification implements ISpecification<{ status: WorkerStatus, health: WorkerHealth }> {
  isSatisfiedBy(candidate: { status: WorkerStatus, health: WorkerHealth }): boolean {
    return candidate.status === WorkerStatus.Idle && candidate.health === WorkerHealth.Healthy;
  }
}
