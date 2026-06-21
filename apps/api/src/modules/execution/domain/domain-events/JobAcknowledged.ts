import { IDomainEvent } from '@rrss-auto/domain';
import { JobId } from '../value-objects/JobId';

export class JobAcknowledged implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly jobId: JobId,
    public readonly workerId: string,
  ) { this.occurredAt = new Date(); }
  getAggregateId(): JobId { return this.jobId; }
}
