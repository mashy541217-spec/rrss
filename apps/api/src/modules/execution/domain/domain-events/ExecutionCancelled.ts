import { IDomainEvent } from '@rrss-auto/domain';
import { ExecutionId } from '../value-objects/ExecutionId';

export class ExecutionCancelled implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly executionId: ExecutionId,
    public readonly reason: string,
    public readonly cancelledBy: string,
  ) { this.occurredAt = new Date(); }
  getAggregateId(): ExecutionId { return this.executionId; }
}
