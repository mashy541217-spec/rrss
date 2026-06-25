import { Controller, Post, Delete, Body, Param, Patch, HttpStatus, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  CreateAutomationDto,
  DuplicateAutomationDto,
  AddTriggerDto,
  AddConditionDto,
  AddActionDto,
  UpdateWorkflowDto,
  GenerateExecutionPlanDto,
} from './dtos/AutomationDtos';

import { CreateAutomationCommand } from '../../application/use-cases/CreateAutomation/CreateAutomationCommand';
import { PublishAutomationCommand } from '../../application/use-cases/PublishAutomation/PublishAutomationCommand';
import { PauseAutomationCommand } from '../../application/use-cases/PauseAutomation/PauseAutomationCommand';
import { ArchiveAutomationCommand } from '../../application/use-cases/ArchiveAutomation/ArchiveAutomationCommand';
import { DuplicateAutomationCommand } from '../../application/use-cases/DuplicateAutomation/DuplicateAutomationCommand';
import { GenerateExecutionPlanCommand } from '../../application/use-cases/GenerateExecutionPlan/GenerateExecutionPlanCommand';
import { AddTriggerCommand } from '../../application/use-cases/AddTrigger/AddTriggerCommand';
import { RemoveTriggerCommand } from '../../application/use-cases/RemoveTrigger/RemoveTriggerCommand';
import { AddConditionCommand } from '../../application/use-cases/AddCondition/AddConditionCommand';
import { RemoveConditionCommand } from '../../application/use-cases/RemoveCondition/RemoveConditionCommand';
import { AddActionCommand } from '../../application/use-cases/AddAction/AddActionCommand';
import { RemoveActionCommand } from '../../application/use-cases/RemoveAction/RemoveActionCommand';
import { UpdateWorkflowCommand } from '../../application/use-cases/UpdateWorkflow/UpdateWorkflowCommand';

@ApiTags('Automation Platform')
@Controller('automations')
export class AutomationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Create new automation' })
  public async createAutomation(@Body() dto: CreateAutomationDto) {
    const id = await this.commandBus.execute(
      new CreateAutomationCommand(dto.workspaceRef, dto.name, dto.description)
    );
    return { id };
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish automation' })
  public async publishAutomation(@Param('id') id: string) {
    await this.commandBus.execute(new PublishAutomationCommand(id));
    return { success: true };
  }

  @Post(':id/pause')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pause automation' })
  public async pauseAutomation(@Param('id') id: string) {
    await this.commandBus.execute(new PauseAutomationCommand(id));
    return { success: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive automation' })
  public async archiveAutomation(@Param('id') id: string) {
    await this.commandBus.execute(new ArchiveAutomationCommand(id));
    return { success: true };
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate automation' })
  public async duplicateAutomation(@Param('id') id: string, @Body() dto: DuplicateAutomationDto) {
    const newId = await this.commandBus.execute(
      new DuplicateAutomationCommand(id, dto.newName)
    );
    return { id: newId };
  }

  @Post(':id/plan')
  @ApiOperation({ summary: 'Generate execution plan' })
  public async generatePlan(@Param('id') id: string, @Body() dto: GenerateExecutionPlanDto) {
    const plan = await this.commandBus.execute(
      new GenerateExecutionPlanCommand(id, dto.strategy)
    );
    return { plan };
  }

  @Post(':id/triggers')
  @ApiOperation({ summary: 'Add trigger to automation' })
  public async addTrigger(@Param('id') id: string, @Body() dto: AddTriggerDto) {
    await this.commandBus.execute(
      new AddTriggerCommand(id, dto.type, dto.configuration)
    );
    return { success: true };
  }

  @Delete(':id/triggers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove trigger from automation' })
  public async removeTrigger(@Param('id') id: string) {
    await this.commandBus.execute(new RemoveTriggerCommand(id));
    return { success: true };
  }

  @Post(':id/conditions')
  @ApiOperation({ summary: 'Add condition to automation' })
  public async addCondition(@Param('id') id: string, @Body() dto: AddConditionDto) {
    await this.commandBus.execute(
      new AddConditionCommand(id, dto.type, dto.expression, dto.configuration)
    );
    return { success: true };
  }

  @Delete(':id/conditions/:conditionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove condition from automation' })
  public async removeCondition(@Param('id') id: string, @Param('conditionId') conditionId: string) {
    await this.commandBus.execute(new RemoveConditionCommand(id, conditionId));
    return { success: true };
  }

  @Post(':id/actions')
  @ApiOperation({ summary: 'Add action to automation' })
  public async addAction(@Param('id') id: string, @Body() dto: AddActionDto) {
    await this.commandBus.execute(
      new AddActionCommand(id, dto.type, dto.name, dto.configuration)
    );
    return { success: true };
  }

  @Delete(':id/actions/:actionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove action from automation' })
  public async removeAction(@Param('id') id: string, @Param('actionId') actionId: string) {
    await this.commandBus.execute(new RemoveActionCommand(id, actionId));
    return { success: true };
  }

  @Patch(':id/workflow')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update workflow nodes and connections' })
  public async updateWorkflow(@Param('id') id: string, @Body() dto: UpdateWorkflowDto) {
    await this.commandBus.execute(
      new UpdateWorkflowCommand(id, dto.nodes, dto.connections)
    );
    return { success: true };
  }
}
