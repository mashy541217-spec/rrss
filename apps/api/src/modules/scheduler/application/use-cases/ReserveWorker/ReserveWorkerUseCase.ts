import { IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IExecutionReservationRepository } from '../../../domain/repositories/IExecutionReservationRepository';
import { ExecutionReservationFactory } from '../../../domain/factories/ExecutionReservationFactory';
import { ExecutionReserved } from '../../../domain/domain-events/ExecutionReserved';
import { WorkerAssigned } from '../../../domain/domain-events/WorkerAssigned';

export interface ReserveWorkerCommand {
  executionId: string;
  workerId: string;
  durationSeconds: number;
}

export class ReserveWorkerUseCase {
  constructor(
    private readonly reservationRepository: IExecutionReservationRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider
  ) {}

  public async execute(command: ReserveWorkerCommand): Promise<string> {
    const rawId = this.identifierProvider.nextId();
    const expiresAt = new Date(Date.now() + command.durationSeconds * 1000);
    
    const reservation = ExecutionReservationFactory.create({
      executionId: command.executionId,
      workerId: command.workerId,
      expiresAt,
    }, rawId);

    await this.reservationRepository.save(reservation);
    
    await this.eventBus.publish(new ExecutionReserved(reservation.id, command.executionId, expiresAt));
    await this.eventBus.publish(new WorkerAssigned(reservation.id, command.workerId, command.executionId));

    return rawId;
  }
}
