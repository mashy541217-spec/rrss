import { IEventBus } from '@rrss-auto/application';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';
import { WorkerId } from '../../../domain/value-objects/WorkerId';
import { WorkerNotFoundException } from '../../../domain/exceptions/WorkerNotFoundException';
import { WorkerStopped } from '../../../domain/domain-events/WorkerStopped';
import { WorkerStatus } from '../../../domain/enums/WorkerStatus';

export interface ShutdownWorkerCommand {
  workerId: string;
  reason: string;
}

export class ShutdownWorkerUseCase {
  constructor(
    private readonly workerRepo: IWorkerRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ShutdownWorkerCommand): Promise<void> {
    const worker = await this.workerRepo.findById(WorkerId.create(command.workerId));
    if (!worker) throw new WorkerNotFoundException(`Worker not found: ${command.workerId}`);

    // Set offline
    // For simplicity, we just manipulate the status directly or via a method
    if (worker.status !== WorkerStatus.Terminated && worker.status !== WorkerStatus.Offline) {
      worker.shutdown(command.reason);
    }

    await this.workerRepo.save(worker);
    await this.eventBus.publishAll(worker.domainEvents);
    worker.clearDomainEvents();
  }
}
