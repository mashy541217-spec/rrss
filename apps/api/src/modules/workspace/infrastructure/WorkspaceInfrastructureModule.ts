import { Module } from '@nestjs/common';
import { WorkspaceMapper } from './database/mappers/WorkspaceMapper';
import { WorkspacePrismaRepository } from './database/repositories/WorkspacePrismaRepository';
import { PrismaService } from '../../../infrastructure/database/prisma/PrismaService';

@Module({
  providers: [
    PrismaService,
    WorkspaceMapper,
    {
      provide: 'IWorkspaceRepository', // Token used for injection
      useClass: WorkspacePrismaRepository,
    },
  ],
  exports: [
    PrismaService,
    'IWorkspaceRepository',
    WorkspaceMapper,
  ],
})
export class WorkspaceInfrastructureModule {}
