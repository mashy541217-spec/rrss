import { IDomainEvent } from '@rrss-auto/domain';
import { ReservationId } from '../value-objects/ReservationId';

export class WorkerAssigned implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly reservationId: ReservationId,
    public readonly workerId: string,
    public readonly executionId: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ReservationId { return this.reservationId; }
}
