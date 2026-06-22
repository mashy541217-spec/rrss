import { IEventBus } from '@rrss-auto/application';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';
import { WorkerId } from '../../../domain/value-objects/WorkerId';
import { WorkerHealth } from '../../../domain/enums/WorkerHealth';
import { WorkerNotFoundException } from '../../../domain/exceptions/WorkerNotFoundException';

export interface HeartbeatWorkerCommand {
  workerId: string;
  healthStatus: string;
  currentLoad: number;
  uptimeSeconds: number;
}

export class HeartbeatWorkerUseCase {
  constructor(
    private readonly workerRepo: IWorkerRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: HeartbeatWorkerCommand): Promise<void> {
    const worker = await this.workerRepo.findById(WorkerId.create(command.workerId));
    if (!worker) throw new WorkerNotFoundException(`Worker not found: ${command.workerId}`);

    worker.recordHeartbeat(command.healthStatus as WorkerHealth, command.currentLoad, command.uptimeSeconds);

    await this.workerRepo.save(worker);
    await this.eventBus.publishAll(worker.domainEvents);
    worker.clearDomainEvents();
  }
}
