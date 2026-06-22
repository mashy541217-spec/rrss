import { ExecutionReservation } from '../aggregates/ExecutionReservation';
import { ReservationId } from '../value-objects/ReservationId';

export interface IExecutionReservationRepository {
  save(reservation: ExecutionReservation): Promise<void>;
  findById(id: ReservationId): Promise<ExecutionReservation | null>;
  delete(id: ReservationId): Promise<void>;
  findByWorkerId(workerId: string): Promise<ExecutionReservation[]>;
  findByExecutionId(executionId: string): Promise<ExecutionReservation | null>;
}
