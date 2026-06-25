import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../../../infrastructure/database/prisma/PrismaService';

@ApiTags('Workers')
@Controller('workers')
export class WorkerController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all registered workers' })
  @ApiResponse({ status: 200, description: 'List of active workers returned successfully' })
  public async list() {
    const workers = await this.prisma.worker.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        heartbeats: {
          orderBy: {
            receivedAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        registeredAt: 'desc',
      },
    });

    return workers.map((w) => {
      const latestHeartbeat = w.heartbeats?.[0];
      return {
        id: w.id,
        hostname: w.hostname,
        status: w.status,
        capabilities: w.capabilities,
        concurrencyLimit: w.concurrencyLimit,
        activeJobCount: w.activeJobCount,
        registeredAt: w.registeredAt,
        cpuUsage: latestHeartbeat?.cpuUsage ?? null,
        memoryUsage: latestHeartbeat?.memoryUsage ?? null,
      };
    });
  }
}
