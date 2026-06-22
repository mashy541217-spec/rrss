import { IEventBus } from '@rrss-auto/application';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';
import { WorkerId } from '../../../domain/value-objects/WorkerId';
import { WorkerNotFoundException } from '../../../domain/exceptions/WorkerNotFoundException';

export interface ResumeWorkerCommand {
  workerId: string;
}

export class ResumeWorkerUseCase {
  constructor(
    private readonly workerRepo: IWorkerRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ResumeWorkerCommand): Promise<void> {
    const worker = await this.workerRepo.findById(WorkerId.create(command.workerId));
    if (!worker) throw new WorkerNotFoundException(`Worker not found: ${command.workerId}`);

    worker.resume();

    await this.workerRepo.save(worker);
    await this.eventBus.publishAll(worker.domainEvents);
    worker.clearDomainEvents();
  }
}
