import { IDomainEvent } from '@rrss-auto/domain';
import { JobId } from '../value-objects/JobId';

export class JobClaimed implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly jobId: JobId,
    public readonly workerId: string,
  ) { this.occurredAt = new Date(); }
  getAggregateId(): JobId { return this.jobId; }
}
