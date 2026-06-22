import { IEventBus } from '@rrss-auto/application';
import { ISchedulerRepository } from '../../../domain/repositories/ISchedulerRepository';
import { SchedulerId } from '../../../domain/value-objects/SchedulerId';
import { SchedulerNotFoundException } from '../../../domain/exceptions/SchedulerNotFoundException';
import { DispatchResult } from '../../../domain/enums/DispatchResult';
import { WorkerAssigned } from '../../../domain/domain-events/WorkerAssigned';
import { SchedulingFailed } from '../../../domain/domain-events/SchedulingFailed';
import { ReservationId } from '../../../domain/value-objects/ReservationId';

export interface DispatchExecutionCommand {
  schedulerId: string;
  executionId: string;
  workerId: string; // Worker selected by infrastructure or queue
  reservationId: string; // Reservation generated when assigned
}

export class DispatchExecutionUseCase {
  constructor(
    private readonly schedulerRepository: ISchedulerRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: DispatchExecutionCommand): Promise<void> {
    const scheduler = await this.schedulerRepository.findById(SchedulerId.create(command.schedulerId));
    if (!scheduler) throw new SchedulerNotFoundException(`Scheduler not found: ${command.schedulerId}`);

    // Normally scheduler evaluates if this specific worker dispatch is valid based on WorkerSelectionPolicy
    // Simplified: Accept dispatch, publish WorkerAssigned.

    await this.eventBus.publish(new WorkerAssigned(
      ReservationId.create(command.reservationId), 
      command.workerId, 
      command.executionId
    ));

    await this.eventBus.publishAll(scheduler.domainEvents);
    scheduler.clearDomainEvents();
  }
}
