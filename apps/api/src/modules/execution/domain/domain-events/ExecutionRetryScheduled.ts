import { IDomainEvent } from '@rrss-auto/domain';
import { ExecutionId } from '../value-objects/ExecutionId';

export class ExecutionRetryScheduled implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly executionId: ExecutionId,
    public readonly attemptNumber: number,
    public readonly backoffMs: number,
  ) { this.occurredAt = new Date(); }
  getAggregateId(): ExecutionId { return this.executionId; }
}
