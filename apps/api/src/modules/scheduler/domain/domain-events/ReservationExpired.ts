import { IDomainEvent } from '@rrss-auto/domain';
import { ReservationId } from '../value-objects/ReservationId';

export class ReservationExpired implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly reservationId: ReservationId,
    public readonly executionId: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ReservationId { return this.reservationId; }
}
