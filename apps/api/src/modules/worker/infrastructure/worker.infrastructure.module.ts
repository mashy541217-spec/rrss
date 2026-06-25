import { Module } from '@nestjs/common';
import { PrismaWorkerRepository } from './database/repositories/PrismaWorkerRepository';
import { PrismaWorkerSessionRepository } from './database/repositories/PrismaWorkerSessionRepository';
import { WorkerMapper } from './database/mappers/WorkerMapper';
import { WorkerSessionMapper } from './database/mappers/WorkerSessionMapper';
import { HeartbeatMapper } from './database/mappers/HeartbeatMapper';
import { AssignmentMapper } from './database/mappers/AssignmentMapper';
import { PrismaService } from '../../../infrastructure/database/prisma/PrismaService';

@Module({
  providers: [
    PrismaService,
    PrismaWorkerRepository,
    PrismaWorkerSessionRepository,
    WorkerMapper,
    WorkerSessionMapper,
    HeartbeatMapper,
    AssignmentMapper,
  ],
  exports: [
    PrismaService,
    PrismaWorkerRepository,
    PrismaWorkerSessionRepository,
  ]
})
export class WorkerInfrastructureModule {}
