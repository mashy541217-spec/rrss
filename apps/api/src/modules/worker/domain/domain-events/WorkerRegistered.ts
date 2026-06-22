import { IDomainEvent } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';
import { WorkerType } from '../enums/WorkerType';
import { WorkerEndpoint } from '../value-objects/WorkerEndpoint';

export class WorkerRegistered implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly workerId: WorkerId,
    public readonly type: WorkerType,
    public readonly endpoint: WorkerEndpoint
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): WorkerId { return this.workerId; }
}
