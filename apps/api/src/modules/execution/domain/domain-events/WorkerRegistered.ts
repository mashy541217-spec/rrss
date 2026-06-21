import { IDomainEvent } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';
import { WorkerCapability } from '../value-objects/WorkerCapability';

export class WorkerRegistered implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly workerId: WorkerId,
    public readonly capabilities: readonly WorkerCapability[],
    public readonly hostname: string,
  ) { this.occurredAt = new Date(); }
  getAggregateId(): WorkerId { return this.workerId; }
}
