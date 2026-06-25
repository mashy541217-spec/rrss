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
    return this.prisma.worker.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        registeredAt: 'desc',
      },
    });
  }
}
