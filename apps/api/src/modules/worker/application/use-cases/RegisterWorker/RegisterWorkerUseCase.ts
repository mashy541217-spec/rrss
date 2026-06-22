import { IEventBus } from '@rrss-auto/application';
import { IIdentifierProvider } from '@rrss-auto/domain';
import { IWorkerRepository } from '../../../domain/repositories/IWorkerRepository';
import { Worker } from '../../../domain/aggregates/Worker';
import { WorkerId } from '../../../domain/value-objects/WorkerId';
import { WorkerType } from '../../../domain/enums/WorkerType';
import { WorkerEndpoint } from '../../../domain/value-objects/WorkerEndpoint';
import { WorkerCapacity } from '../../../domain/value-objects/WorkerCapacity';

export interface RegisterWorkerCommand {
  workerType: string;
  endpointUrl: string;
  maxExecutions: number;
}

export class RegisterWorkerUseCase {
  constructor(
    private readonly workerRepo: IWorkerRepository,
    private readonly eventBus: IEventBus,
    private readonly idProvider: IIdentifierProvider
  ) {}

  public async execute(command: RegisterWorkerCommand): Promise<string> {
    const rawId = this.idProvider.nextId();
    
    const worker = Worker.register(
      WorkerId.create(rawId),
      command.workerType as WorkerType,
      WorkerEndpoint.create(command.endpointUrl),
      WorkerCapacity.create(command.maxExecutions)
    );

    // Automatically start session upon registration
    worker.startSession(`sess-${this.idProvider.nextId()}`);

    await this.workerRepo.save(worker);
    await this.eventBus.publishAll(worker.domainEvents);
    worker.clearDomainEvents();

    return rawId;
  }
}
