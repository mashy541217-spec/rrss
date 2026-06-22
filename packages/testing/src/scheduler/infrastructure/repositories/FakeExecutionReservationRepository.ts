import { ExecutionReservation } from '../../../../../../apps/api/src/modules/scheduler/domain/aggregates/ExecutionReservation';
import { ReservationId } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/ReservationId';
import { IExecutionReservationRepository } from '../../../../../../apps/api/src/modules/scheduler/domain/repositories/IExecutionReservationRepository';

export class FakeExecutionReservationRepository implements IExecutionReservationRepository {
  private items = new Map<string, ExecutionReservation>();

  public async save(reservation: ExecutionReservation): Promise<void> {
    this.items.set(reservation.id.value, reservation);
  }

  public async findById(id: ReservationId): Promise<ExecutionReservation | null> {
    return this.items.get(id.value) || null;
  }

  public async delete(id: ReservationId): Promise<void> {
    this.items.delete(id.value);
  }

  public async findByWorkerId(workerId: string): Promise<ExecutionReservation[]> {
    return Array.from(this.items.values()).filter(r => r.workerId === workerId);
  }

  public async findByExecutionId(executionId: string): Promise<ExecutionReservation | null> {
    return Array.from(this.items.values()).find(r => r.executionId === executionId) || null;
  }
}
