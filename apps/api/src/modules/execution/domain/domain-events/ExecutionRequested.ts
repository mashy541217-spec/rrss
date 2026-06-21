import { IDomainEvent } from '@rrss-auto/domain';
import { ExecutionId } from '../value-objects/ExecutionId';
import { ExecutionPriority } from '../enums/ExecutionPriority';

export class ExecutionRequested implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly executionId: ExecutionId,
    public readonly workspaceRef: string,
    public readonly actor: string,
    public readonly intent: string,
    public readonly priority: ExecutionPriority,
    public readonly idempotencyKey: string,
  ) { this.occurredAt = new Date(); }
  getAggregateId(): ExecutionId { return this.executionId; }
}
