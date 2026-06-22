import { AggregateRoot } from '@rrss-auto/domain';
import { ReservationId } from '../value-objects/ReservationId';
import { ResourceType } from '../value-objects/ResourceType';
import { ReservationStatus } from '../enums/ReservationStatus';
import { ResourceReserved } from '../domain-events/ResourceReserved';
import { ResourceId } from '../value-objects/ResourceId';

export interface ResourceReservationProps {
  type: ResourceType;
  executionId: string;
  status: ReservationStatus;
  createdAt: Date;
  expiresAt: Date;
  fulfilledWithResourceId?: ResourceId;
}

export class ResourceReservation extends AggregateRoot<ResourceReservationProps, ReservationId> {
  private constructor(props: ResourceReservationProps, id: ReservationId) {
    super(props, id);
  }

  get type(): ResourceType { return this.props.type; }
  get executionId(): string { return this.props.executionId; }
  get status(): ReservationStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get fulfilledWithResourceId(): ResourceId | undefined { return this.props.fulfilledWithResourceId; }

  public static create(type: ResourceType, executionId: string, durationSeconds: number, id: ReservationId): ResourceReservation {
    return new ResourceReservation({
      type,
      executionId,
      status: ReservationStatus.Pending,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + durationSeconds * 1000),
    }, id);
  }

  public fulfill(resourceId: ResourceId): void {
    if (this.props.status !== ReservationStatus.Pending) {
      throw new Error('Cannot fulfill a non-pending reservation');
    }
    this.props.status = ReservationStatus.Fulfilled;
    this.props.fulfilledWithResourceId = resourceId;
    this.addDomainEvent(new ResourceReserved(resourceId, this.id));
  }

  public cancel(): void {
    if (this.props.status !== ReservationStatus.Pending) return;
    this.props.status = ReservationStatus.Cancelled;
  }

  public timeout(): void {
    if (this.props.status !== ReservationStatus.Pending) return;
    this.props.status = ReservationStatus.Timeout;
  }
}
