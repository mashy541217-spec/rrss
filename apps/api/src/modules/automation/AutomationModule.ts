import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AutomationController } from './presentation/http/AutomationController';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { PrismaAutomationRepository } from './infrastructure/database/repositories/PrismaAutomationRepository';
import { AutomationMapper } from './infrastructure/database/mappers/AutomationMapper';

// Application Use Cases
import { CreateAutomationUseCase } from './application/use-cases/CreateAutomation/CreateAutomationUseCase';
import { PublishAutomationUseCase } from './application/use-cases/PublishAutomation/PublishAutomationUseCase';
import { PauseAutomationUseCase } from './application/use-cases/PauseAutomation/PauseAutomationUseCase';
import { ArchiveAutomationUseCase } from './application/use-cases/ArchiveAutomation/ArchiveAutomationUseCase';
import { DuplicateAutomationUseCase } from './application/use-cases/DuplicateAutomation/DuplicateAutomationUseCase';
import { GenerateExecutionPlanUseCase } from './application/use-cases/GenerateExecutionPlan/GenerateExecutionPlanUseCase';
import { AddTriggerUseCase } from './application/use-cases/AddTrigger/AddTriggerUseCase';
import { RemoveTriggerUseCase } from './application/use-cases/RemoveTrigger/RemoveTriggerUseCase';
import { AddConditionUseCase } from './application/use-cases/AddCondition/AddConditionUseCase';
import { RemoveConditionUseCase } from './application/use-cases/RemoveCondition/RemoveConditionUseCase';
import { AddActionUseCase } from './application/use-cases/AddAction/AddActionUseCase';
import { RemoveActionUseCase } from './application/use-cases/RemoveAction/RemoveActionUseCase';
import { UpdateWorkflowUseCase } from './application/use-cases/UpdateWorkflow/UpdateWorkflowUseCase';

const CommandHandlers = [
  CreateAutomationUseCase,
  PublishAutomationUseCase,
  PauseAutomationUseCase,
  ArchiveAutomationUseCase,
  DuplicateAutomationUseCase,
  GenerateExecutionPlanUseCase,
  AddTriggerUseCase,
  RemoveTriggerUseCase,
  AddConditionUseCase,
  RemoveConditionUseCase,
  AddActionUseCase,
  RemoveActionUseCase,
  UpdateWorkflowUseCase,
];

@Module({
  imports: [CqrsModule],
  controllers: [AutomationController],
  providers: [
    ...CommandHandlers,
    PrismaService,
    AutomationMapper,
    {
      provide: 'IAutomationRepository',
      useClass: PrismaAutomationRepository,
    },
  ],
  exports: ['IAutomationRepository'],
})
export class AutomationModule {}
