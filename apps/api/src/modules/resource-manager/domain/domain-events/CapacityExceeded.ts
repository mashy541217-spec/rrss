import { IDomainEvent, ValueObject } from '@rrss-auto/domain';
import { ResourceType } from '../value-objects/ResourceType';

export class CapacityExceeded implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly resourceType: ResourceType,
    public readonly required: number,
    public readonly available: number
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return this.resourceType; } // Represents the pool identity in a way
}
