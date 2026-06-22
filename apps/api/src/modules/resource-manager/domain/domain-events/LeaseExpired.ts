import { IDomainEvent } from '@rrss-auto/domain';
import { LeaseId } from '../value-objects/LeaseId';
import { ResourceId } from '../value-objects/ResourceId';

export class LeaseExpired implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly leaseId: LeaseId,
    public readonly resourceId: ResourceId
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): LeaseId { return this.leaseId; }
}
