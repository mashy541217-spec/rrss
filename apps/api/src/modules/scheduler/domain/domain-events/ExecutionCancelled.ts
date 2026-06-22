import { IDomainEvent } from '@rrss-auto/domain';
import { ScheduleId } from '../value-objects/ScheduleId';

export class ExecutionCancelled implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly scheduleId: ScheduleId,
    public readonly executionId: string,
    public readonly reason: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ScheduleId { return this.scheduleId; }
}
