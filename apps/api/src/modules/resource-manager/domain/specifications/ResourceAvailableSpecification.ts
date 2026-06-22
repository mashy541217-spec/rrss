import { ISpecification } from './ISpecification';
import { ResourceStatus } from '../enums/ResourceStatus';
import { ResourceHealth } from '../enums/ResourceHealth';

export class ResourceAvailableSpecification implements ISpecification<{ status: ResourceStatus, health: ResourceHealth }> {
  isSatisfiedBy(candidate: { status: ResourceStatus, health: ResourceHealth }): boolean {
    return candidate.status === ResourceStatus.Available && candidate.health === ResourceHealth.Healthy;
  }
}
