import { IDomainEvent } from '@rrss-auto/domain';
import { ResourceId } from '../value-objects/ResourceId';

export class ResourceReleased implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly resourceId: ResourceId,
    public readonly reason: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ResourceId { return this.resourceId; }
}
