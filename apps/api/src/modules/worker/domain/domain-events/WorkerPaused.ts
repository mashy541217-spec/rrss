import { IDomainEvent } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';

export class WorkerPaused implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly workerId: WorkerId,
    public readonly reason: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): WorkerId { return this.workerId; }
}
