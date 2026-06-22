import { ExecutionReservation, ExecutionReservationProps } from '../aggregates/ExecutionReservation';
import { ReservationId } from '../value-objects/ReservationId';

export class ExecutionReservationFactory {
  public static create(props: Omit<ExecutionReservationProps, 'status' | 'reservedAt'>, rawId: string): ExecutionReservation {
    const id = ReservationId.create(rawId);
    return ExecutionReservation.create(props, id);
  }
}
