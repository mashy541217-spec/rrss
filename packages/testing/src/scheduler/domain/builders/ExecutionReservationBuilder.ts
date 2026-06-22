import { ExecutionReservation } from '../../../../../../apps/api/src/modules/scheduler/domain/aggregates/ExecutionReservation';
import { ReservationId } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/ReservationId';

export class ExecutionReservationBuilder {
  private id: string = 'res-123';
  private executionId: string = 'exec-123';
  private workerId: string = 'worker-123';
  private reservedAt: Date = new Date();
  private expiresAt: Date = new Date(Date.now() + 60000);
  private status: 'active' | 'expired' | 'released' = 'active';

  public static create(): ExecutionReservationBuilder { return new ExecutionReservationBuilder(); }

  public withId(id: string): this { this.id = id; return this; }
  public withExecutionId(executionId: string): this { this.executionId = executionId; return this; }
  public withWorkerId(workerId: string): this { this.workerId = workerId; return this; }
  public withReservedAt(reservedAt: Date): this { this.reservedAt = reservedAt; return this; }
  public withExpiresAt(expiresAt: Date): this { this.expiresAt = expiresAt; return this; }
  public withStatus(status: 'active' | 'expired' | 'released'): this { this.status = status; return this; }

  public build(): ExecutionReservation {
    const res = ExecutionReservation.create({
      executionId: this.executionId,
      workerId: this.workerId,
      expiresAt: this.expiresAt,
    }, ReservationId.create(this.id));
    
    // We force status through private access for tests if needed, or we rely on public methods
    if (this.status === 'expired') res.expire();
    if (this.status === 'released') res.release();
    
    return res;
  }
}
