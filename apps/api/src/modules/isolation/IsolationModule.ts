import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IsolationController } from './presentation/http/IsolationController';
import { EvaluateIsolationUseCase } from './application/EvaluateIsolationUseCase';
import { ProvisionIsolationUseCase } from './application/ProvisionIsolationUseCase';
import { ProvisioningStore } from './application/ProvisioningStore';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { CredentialModule } from '../credentials/CredentialModule';
import { ResourceManagerInfrastructureModule } from '../resource-manager/infrastructure/resource-manager.infrastructure.module';
import { PrismaResourcePoolRepository } from '../resource-manager/infrastructure/database/repositories/PrismaResourcePoolRepository';
import { PrismaLeaseRepository } from '../resource-manager/infrastructure/database/repositories/PrismaLeaseRepository';
import { AllocateVMUseCase } from '../resource-manager/application/use-cases/AllocateVM/AllocateVMUseCase';
import { AllocateWorkerUseCase } from '../resource-manager/application/use-cases/AllocateWorker/AllocateWorkerUseCase';

@Module({
  imports: [
    CqrsModule,
    CredentialModule,
    ResourceManagerInfrastructureModule
  ],
  controllers: [IsolationController],
  providers: [
    EvaluateIsolationUseCase,
    ProvisionIsolationUseCase,
    ProvisioningStore,
    PrismaService,
    {
      provide: AllocateVMUseCase,
      useFactory: (poolRepo: PrismaResourcePoolRepository, leaseRepo: PrismaLeaseRepository, eventBus: any, idProvider: any) => {
        return new AllocateVMUseCase(poolRepo, leaseRepo, eventBus, idProvider);
      },
      inject: [PrismaResourcePoolRepository, PrismaLeaseRepository, 'IEventBus', 'IIdentifierProvider']
    },
    {
      provide: AllocateWorkerUseCase,
      useFactory: (poolRepo: PrismaResourcePoolRepository, leaseRepo: PrismaLeaseRepository, eventBus: any, idProvider: any) => {
        return new AllocateWorkerUseCase(poolRepo, leaseRepo, eventBus, idProvider);
      },
      inject: [PrismaResourcePoolRepository, PrismaLeaseRepository, 'IEventBus', 'IIdentifierProvider']
    }
  ],
  exports: [
    ProvisioningStore
  ]
})
export class IsolationModule {}
