import { ISpecification } from './ISpecification';

export class CapacityAvailableSpecification implements ISpecification<{ total: number, used: number, requested: number }> {
  isSatisfiedBy(candidate: { total: number, used: number, requested: number }): boolean {
    return (candidate.total - candidate.used) >= candidate.requested;
  }
}
