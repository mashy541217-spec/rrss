import { IDomainEvent } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';

export class ExecutionCompletedByWorker implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly workerId: WorkerId,
    public readonly executionId: string,
    public readonly durationMs: number
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): WorkerId { return this.workerId; }
}
