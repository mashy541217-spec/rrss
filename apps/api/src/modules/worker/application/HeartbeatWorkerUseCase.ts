import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkerHealth } from '../../domain/value-objects/WorkerHealth';

export class HeartbeatWorkerCommand {
  constructor(
    public readonly workerId: string,
    public readonly cpuUsagePercent: number,
    public readonly ramUsageMb: number,
    public readonly totalRamMb: number,
    public readonly activeJobs: number,
    public readonly browserSessions: number,
    public readonly networkLatencyMs: number,
    public readonly temperatureCelsius?: number
  ) {}
}

@CommandHandler(HeartbeatWorkerCommand)
export class HeartbeatWorkerUseCase implements ICommandHandler<HeartbeatWorkerCommand> {
  // constructor(private readonly workerRepository: IWorkerRepository) {}

  async execute(command: HeartbeatWorkerCommand): Promise<void> {
    const health = new WorkerHealth(
      command.cpuUsagePercent,
      command.ramUsageMb,
      command.totalRamMb,
      command.activeJobs,
      command.browserSessions,
      command.networkLatencyMs,
      true,
      command.temperatureCelsius
    );

    // const worker = await this.workerRepository.findById(command.workerId);
    // if (!worker) throw new Error('Worker not found');
    // worker.updateHeartbeat(health);
    // await this.workerRepository.save(worker);

    // console.log(`[Worker] Heartbeat received from ${command.workerId}. Load Score: ${health.loadScore}`);
  }
}
