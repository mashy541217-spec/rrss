import { IDomainEvent } from '@rrss-auto/domain';
import { JobId } from '../value-objects/JobId';

export class JobCreated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly jobId: JobId,
    public readonly executionId: string,
    public readonly workspaceRef: string,
  ) { this.occurredAt = new Date(); }
  getAggregateId(): JobId { return this.jobId; }
}
