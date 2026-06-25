import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Worker, WorkerStatus } from '../domain/Worker';
import { WorkerCapabilities } from '../domain/value-objects/WorkerCapabilities';

export class RegisterWorkerCommand {
  constructor(
    public readonly workerId: string,
    public readonly hostname: string,
    public readonly version: string,
    public readonly platform: string,
    public readonly architecture: string,
    public readonly installedPlugins: string[],
    public readonly browserEngines: string[],
    public readonly aiSupport: boolean
  ) {}
}

@CommandHandler(RegisterWorkerCommand)
export class RegisterWorkerUseCase implements ICommandHandler<RegisterWorkerCommand> {
  // In a real app, this would be injected
  // constructor(private readonly workerRepository: IWorkerRepository) {}

  async execute(command: RegisterWorkerCommand): Promise<Worker> {
    const capabilities = new WorkerCapabilities(
      command.installedPlugins,
      command.browserEngines,
      command.aiSupport,
      command.platform,
      command.architecture
    );

    const worker = new Worker(
      command.workerId,
      command.hostname,
      command.version,
      WorkerStatus.ONLINE,
      capabilities,
      {},
      'local-pc',
      null,
      new Date(),
      new Date()
    );

    // await this.workerRepository.save(worker);
    console.log(`[Worker] Registered new worker ${worker.id} at ${worker.hostname}`);
    return worker;
  }
}
