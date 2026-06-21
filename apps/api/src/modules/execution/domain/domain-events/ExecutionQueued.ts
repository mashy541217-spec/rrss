import { IDomainEvent } from '@rrss-auto/domain';
import { ExecutionId } from '../value-objects/ExecutionId';

export class ExecutionQueued implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly executionId: ExecutionId) { this.occurredAt = new Date(); }
  getAggregateId(): ExecutionId { return this.executionId; }
}
