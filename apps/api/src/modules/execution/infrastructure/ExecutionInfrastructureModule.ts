import { Module } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma/PrismaService';
import { ExecutionMapper } from './database/mappers/ExecutionMapper';
import { ExecutionStepMapper } from './database/mappers/ExecutionStepMapper';
import { JobMapper } from './database/mappers/JobMapper';
import { PrismaExecutionRepository } from './database/repositories/PrismaExecutionRepository';
import { PrismaExecutionStepRepository } from './database/repositories/PrismaExecutionStepRepository';
import { PrismaJobRepository } from './database/repositories/PrismaJobRepository';

@Module({
  providers: [
    PrismaService,
    ExecutionMapper,
    ExecutionStepMapper,
    JobMapper,
    {
      provide: 'IExecutionRepository',
      useClass: PrismaExecutionRepository,
    },
    {
      provide: 'IExecutionStepRepository',
      useClass: PrismaExecutionStepRepository,
    },
    {
      provide: 'IJobRepository',
      useClass: PrismaJobRepository,
    },
  ],
  exports: [
    'IExecutionRepository',
    'IExecutionStepRepository',
    'IJobRepository',
  ],
})
export class ExecutionInfrastructureModule {}
