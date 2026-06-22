import { IDomainEvent } from '@rrss-auto/domain';
import { ResourceId } from '../value-objects/ResourceId';
import { ReservationId } from '../value-objects/ReservationId';

export class ResourceReserved implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly resourceId: ResourceId,
    public readonly reservationId: ReservationId
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ResourceId { return this.resourceId; }
}
