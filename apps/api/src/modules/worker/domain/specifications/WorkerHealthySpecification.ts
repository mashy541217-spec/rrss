import { ISpecification } from './ISpecification';
import { WorkerHealth } from '../enums/WorkerHealth';

export class WorkerHealthySpecification implements ISpecification<{ health: WorkerHealth }> {
  isSatisfiedBy(candidate: { health: WorkerHealth }): boolean {
    return candidate.health === WorkerHealth.Healthy;
  }
}
