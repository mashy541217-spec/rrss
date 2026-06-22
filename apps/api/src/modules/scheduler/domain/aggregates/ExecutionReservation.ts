import { Entity } from '@rrss-auto/domain';
import { ReservationId } from '../value-objects/ReservationId';

export interface ExecutionReservationProps {
  executionId: string;
  workerId: string;
  reservedAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired' | 'released';
}

export class ExecutionReservation extends Entity<ExecutionReservationProps, ReservationId> {
  private constructor(props: ExecutionReservationProps, id: ReservationId) {
    super(props, id);
  }

  get executionId(): string { return this.props.executionId; }
  get workerId(): string { return this.props.workerId; }
  get reservedAt(): Date { return this.props.reservedAt; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get status(): string { return this.props.status; }
  get isExpired(): boolean { return this.status === 'expired' || new Date() > this.expiresAt; }

  public static create(props: Omit<ExecutionReservationProps, 'status' | 'reservedAt'>, id: ReservationId): ExecutionReservation {
    return new ExecutionReservation({
      ...props,
      reservedAt: new Date(),
      status: 'active',
    }, id);
  }

  public release(): void {
    if (this.props.status !== 'active') return;
    this.props.status = 'released';
  }

  public expire(): void {
    if (this.props.status !== 'active') return;
    this.props.status = 'expired';
  }
}
