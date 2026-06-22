import { ISpecification } from './ISpecification';

export class ReservationValidSpecification implements ISpecification<{ expiresAt: Date, isCancelled: boolean, isFulfilled: boolean }> {
  isSatisfiedBy(candidate: { expiresAt: Date, isCancelled: boolean, isFulfilled: boolean }): boolean {
    if (candidate.isCancelled || candidate.isFulfilled) return false;
    return new Date() <= candidate.expiresAt;
  }
}
