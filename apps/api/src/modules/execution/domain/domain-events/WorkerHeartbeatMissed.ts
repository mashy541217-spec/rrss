import { IDomainEvent } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';

export class WorkerHeartbeatMissed implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly workerId: WorkerId,
    public readonly lastSeenAt: Date,
    public readonly currentJobId?: string,
  ) { this.occurredAt = new Date(); }
  getAggregateId(): WorkerId { return this.workerId; }
}
