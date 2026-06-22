import { ISpecification } from './ISpecification';

export class LeaseExpiredSpecification implements ISpecification<{ expiresAt: Date }> {
  isSatisfiedBy(candidate: { expiresAt: Date }): boolean {
    return new Date() > candidate.expiresAt;
  }
}
