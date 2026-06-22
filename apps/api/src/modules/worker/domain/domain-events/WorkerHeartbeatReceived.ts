import { IDomainEvent } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';
import { WorkerHealth } from '../enums/WorkerHealth';

export class WorkerHeartbeatReceived implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly workerId: WorkerId,
    public readonly reportedHealth: WorkerHealth,
    public readonly currentLoad: number
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): WorkerId { return this.workerId; }
}
