import { IEventBus } from '@rrss-auto/application';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';
import { WorkerId } from '../../../domain/value-objects/WorkerId';
import { WorkerNotFoundException } from '../../../domain/exceptions/WorkerNotFoundException';

export interface DrainWorkerCommand {
  workerId: string;
}

export class DrainWorkerUseCase {
  constructor(
    private readonly workerRepo: IWorkerRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: DrainWorkerCommand): Promise<void> {
    const worker = await this.workerRepo.findById(WorkerId.create(command.workerId));
    if (!worker) throw new WorkerNotFoundException(`Worker not found: ${command.workerId}`);

    // Draining simply pauses the worker from taking NEW executions.
    worker.pause('Draining node for maintenance');

    await this.workerRepo.save(worker);
    await this.eventBus.publishAll(worker.domainEvents);
    worker.clearDomainEvents();
  }
}
