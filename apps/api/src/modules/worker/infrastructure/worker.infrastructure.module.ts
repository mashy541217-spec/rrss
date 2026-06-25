import { Module } from '@nestjs/common';
import { PrismaWorkerRepository } from './database/repositories/PrismaWorkerRepository';
import { PrismaWorkerSessionRepository } from './database/repositories/PrismaWorkerSessionRepository';
import { WorkerMapper } from './database/mappers/WorkerMapper';
import { WorkerSessionMapper } from './database/mappers/WorkerSessionMapper';
import { HeartbeatMapper } from './database/mappers/HeartbeatMapper';
import { AssignmentMapper } from './database/mappers/AssignmentMapper';

@Module({
  providers: [
    PrismaWorkerRepository,
    PrismaWorkerSessionRepository,
    WorkerMapper,
    WorkerSessionMapper,
    HeartbeatMapper,
    AssignmentMapper,
  ],
  exports: [
    PrismaWorkerRepository,
    PrismaWorkerSessionRepository,
  ]
})
export class WorkerInfrastructureModule {}
