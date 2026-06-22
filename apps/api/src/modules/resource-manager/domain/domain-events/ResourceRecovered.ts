import { IDomainEvent } from '@rrss-auto/domain';
import { ResourceId } from '../value-objects/ResourceId';

export class ResourceRecovered implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly resourceId: ResourceId
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ResourceId { return this.resourceId; }
}
