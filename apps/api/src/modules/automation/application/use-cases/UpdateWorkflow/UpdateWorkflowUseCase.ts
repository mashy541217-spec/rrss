import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUseCase, IEventBus } from '@rrss-auto/application';
import { UpdateWorkflowCommand } from './UpdateWorkflowCommand';
import { IAutomationRepository } from '../../../domain/repositories/IAutomationRepository';
import { AutomationId } from '../../../domain/value-objects/AutomationId';
import { WorkflowNode } from '../../../domain/entities/WorkflowNode';
import { WorkflowConnection } from '../../../domain/entities/WorkflowConnection';
import { NodeId } from '../../../domain/value-objects/NodeId';
import { ConnectionId } from '../../../domain/value-objects/ConnectionId';
import { NodeType } from '../../../domain/enums/NodeType';

@Injectable()
@CommandHandler(UpdateWorkflowCommand)
export class UpdateWorkflowUseCase implements IUseCase<UpdateWorkflowCommand, void>, ICommandHandler<UpdateWorkflowCommand, void> {
  constructor(
    @Inject('IAutomationRepository') private readonly repository: IAutomationRepository,
    @Inject('IEventBus') private readonly eventBus: IEventBus
  ) {}

  public async execute(command: UpdateWorkflowCommand): Promise<void> {
    const automationId = AutomationId.create(command.id);
    const automation = await this.repository.findById(automationId);
    if (!automation) throw new Error('Automation not found');

    const nodes = command.nodes.map(n =>
      WorkflowNode.create({
        name: n.name,
        type: n.type as NodeType,
        config: n.config,
        positionX: n.positionX || 0,
        positionY: n.positionY || 0,
      }, NodeId.create(n.id))
    );

    const connections = command.connections.map(c =>
      WorkflowConnection.create({
        sourceId: c.sourceId,
        targetId: c.targetId,
        sourceHandle: c.sourceHandle,
        targetHandle: c.targetHandle,
        condition: c.condition,
      }, ConnectionId.create(c.id))
    );

    automation.typeUpdateWorkflow(nodes, connections);

    await this.repository.save(automation);
    await this.eventBus.publishAll(automation.domainEvents);
    automation.clearDomainEvents();
  }
}
