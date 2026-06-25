import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../infrastructure/database/prisma/PrismaService';

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
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: RegisterWorkerCommand): Promise<any> {
    const capabilities = {
      installedPlugins: command.installedPlugins,
      browserEngines: command.browserEngines,
      aiSupport: command.aiSupport,
      platform: command.platform,
      architecture: command.architecture
    };

    // Upsert worker in database
    const dbWorker = await this.prisma.worker.upsert({
      where: { id: command.workerId },
      update: {
        hostname: command.hostname,
        status: 'ONLINE',
        capabilities: capabilities as any,
        concurrencyLimit: 4,
        isDeleted: false,
        version: { increment: 1 }
      },
      create: {
        id: command.workerId,
        hostname: command.hostname,
        status: 'ONLINE',
        capabilities: capabilities as any,
        concurrencyLimit: 4,
        activeJobCount: 0,
        registeredAt: new Date(),
        version: 1,
        isDeleted: false
      }
    });

    console.log(`[Worker] Registered worker ${dbWorker.id} (${dbWorker.hostname}) in database.`);
    return dbWorker;
  }
}
