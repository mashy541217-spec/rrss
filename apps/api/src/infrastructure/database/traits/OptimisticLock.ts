/**
 * Exception thrown when an optimistic lock version mismatch is detected.
 * This ensures updates do not overwrite concurrent modifications.
 */
export class ConcurrencyException extends Error {
  constructor(public readonly aggregateName: string, public readonly aggregateId: string) {
    super(`Concurrency conflict detected for ${aggregateName} with ID ${aggregateId}. The data was modified by another transaction.`);
    this.name = 'ConcurrencyException';
  }
}

/**
 * Interface that Aggregate Models must implement to support Optimistic Locking.
 */
export interface OptimisticLock {
  version: number;
}
