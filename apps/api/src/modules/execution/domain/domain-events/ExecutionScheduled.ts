import { IDomainEvent } from '@rrss-auto/domain';
import { ExecutionId } from '../value-objects/ExecutionId';

export class ExecutionScheduled implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly executionId: ExecutionId,
    public readonly scheduledFor?: Date,
  ) { this.occurredAt = new Date(); }
  getAggregateId(): ExecutionId { return this.executionId; }
}
