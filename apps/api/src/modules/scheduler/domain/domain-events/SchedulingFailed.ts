import { IDomainEvent } from '@rrss-auto/domain';
import { SchedulerId } from '../value-objects/SchedulerId';

export class SchedulingFailed implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly schedulerId: SchedulerId,
    public readonly executionId: string,
    public readonly reason: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): SchedulerId { return this.schedulerId; }
}
