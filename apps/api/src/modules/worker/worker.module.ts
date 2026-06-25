import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkerController } from './presentation/http/WorkerController';
import { WorkerGateway } from './presentation/WorkerGateway';
import { WorkerInfrastructureModule } from './infrastructure/worker.infrastructure.module';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { RegisterWorkerUseCase } from './application/RegisterWorkerUseCase';
import { HeartbeatWorkerUseCase } from './application/HeartbeatWorkerUseCase';

@Module({
  imports: [
    CqrsModule,
    WorkerInfrastructureModule,
  ],
  controllers: [WorkerController],
  providers: [
    WorkerGateway,
    PrismaService,
    RegisterWorkerUseCase,
    HeartbeatWorkerUseCase,
  ],
  exports: [
    WorkerGateway,
  ]
})
export class WorkerModule {}
