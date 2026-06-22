import { IDomainEvent } from '@rrss-auto/domain';
import { ReservationId } from '../value-objects/ReservationId';

export class ExecutionReserved implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly reservationId: ReservationId,
    public readonly executionId: string,
    public readonly expiresAt: Date
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ReservationId { return this.reservationId; }
}
