import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../infrastructure/database/prisma/PrismaService';
import { randomUUID } from 'crypto';

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
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: HeartbeatWorkerCommand): Promise<void> {
    const receivedAt = new Date();
    
    // We update the worker status and last active time/count
    await this.prisma.worker.updateMany({
      where: { id: command.workerId },
      data: {
        status: 'ONLINE',
        activeJobCount: command.activeJobs,
      }
    });

    // We insert a heartbeat log record
    await this.prisma.workerHeartbeat.create({
      data: {
        id: randomUUID(),
        workerId: command.workerId,
        receivedAt,
        cpuUsage: command.cpuUsagePercent,
        memoryUsage: command.ramUsageMb,
        status: 'ONLINE'
      }
    });

    console.log(`[Worker] Heartbeat saved for ${command.workerId} (CPU: ${command.cpuUsagePercent}%, RAM: ${command.ramUsageMb}MB)`);
  }
}
