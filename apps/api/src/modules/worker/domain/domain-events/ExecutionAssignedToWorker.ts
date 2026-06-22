import { IDomainEvent } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';

export class ExecutionAssignedToWorker implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly workerId: WorkerId,
    public readonly executionId: string,
    public readonly slotId: number
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): WorkerId { return this.workerId; }
}
