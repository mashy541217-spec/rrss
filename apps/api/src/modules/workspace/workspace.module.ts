import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkspaceInfrastructureModule } from './infrastructure/WorkspaceInfrastructureModule';
import { WorkspaceController } from './presentation/http/controllers/WorkspaceController';
import { BusinessController } from './presentation/http/BusinessController';
import { CreateWorkspaceUseCase } from './application/use-cases/CreateWorkspace/CreateWorkspaceUseCase';
import { UpdateWorkspaceSettingsUseCase } from './application/use-cases/UpdateWorkspaceSettings/UpdateWorkspaceSettingsUseCase';

@Module({
  imports: [WorkspaceInfrastructureModule, CqrsModule],
  controllers: [WorkspaceController, BusinessController],
  providers: [
    CreateWorkspaceUseCase,
    UpdateWorkspaceSettingsUseCase
  ],
})
export class WorkspaceModule {}
