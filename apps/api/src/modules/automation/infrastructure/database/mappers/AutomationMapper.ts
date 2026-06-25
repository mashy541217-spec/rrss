import { Injectable } from '@nestjs/common';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { Automation } from '../../../domain/aggregate/Automation';
import { AutomationId } from '../../../domain/value-objects/AutomationId';
import { AutomationStatus } from '../../../domain/enums/AutomationStatus';
import { VariableDefinition } from '../../../domain/entities/VariableDefinition';
import { TriggerDefinition } from '../../../domain/entities/TriggerDefinition';
import { RetryPolicy } from '../../../domain/value-objects/RetryPolicy';
import { Timeout } from '../../../domain/value-objects/Timeout';
import { WorkflowNode } from '../../../domain/entities/WorkflowNode';
import { WorkflowConnection } from '../../../domain/entities/WorkflowConnection';
import { NodeId } from '../../../domain/value-objects/NodeId';
import { ConnectionId } from '../../../domain/value-objects/ConnectionId';
import { NodeType } from '../../../domain/enums/NodeType';
import { RetryStrategy } from '../../../domain/enums/RetryStrategy';

@Injectable()
export class AutomationMapper
  implements
    AggregateMapper<Automation, AutomationId, any>,
    PersistenceMapper<Automation, AutomationId, any>
{
  public toDomain(model: any): Automation {
    const variables = (model.variables || []).map((v: any) =>
      VariableDefinition.create(v.name, v.value, v.type)
    );

    let trigger: TriggerDefinition | undefined;
    if (model.trigger) {
      trigger = TriggerDefinition.create(model.trigger.type, model.trigger.configuration);
    }

    let retryConfig: RetryPolicy | undefined;
    if (model.retryConfig) {
      retryConfig = RetryPolicy.create(
        model.retryConfig.strategy as RetryStrategy,
        model.retryConfig.attempts,
        model.retryConfig.delay
      );
    }

    let timeoutConfig: Timeout | undefined;
    if (model.timeoutConfig) {
      timeoutConfig = Timeout.create(model.timeoutConfig.value, model.timeoutConfig.unit);
    }

    const nodes = (model.nodes || []).map((n: any) =>
      WorkflowNode.create({
        name: n.name,
        type: n.type as NodeType,
        config: n.config,
        positionX: n.positionX,
        positionY: n.positionY,
      }, NodeId.create(n.id))
    );

    const connections = (model.connections || []).map((c: any) =>
      WorkflowConnection.create({
        sourceId: c.sourceId,
        targetId: c.targetId,
        sourceHandle: c.sourceHandle,
        targetHandle: c.targetHandle,
        condition: c.condition,
      }, ConnectionId.create(c.id))
    );

    return Automation.reconstitute({
      workspaceRef: model.workspaceRef,
      name: model.name,
      description: model.description || undefined,
      status: model.status as AutomationStatus,
      variables,
      trigger,
      retryConfig,
      timeoutConfig,
      executionPlan: model.executionPlan || undefined,
      nodes,
      connections,
      version: model.version,
      isDeleted: model.isDeleted,
      deletedAt: model.deletedAt || undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }, AutomationId.create(model.id));
  }

  public toPersistence(aggregate: Automation): any {
    return {
      id: aggregate.id.value,
      workspaceRef: aggregate.workspaceRef,
      name: aggregate.name,
      description: aggregate.description || null,
      status: aggregate.status,
      variables: aggregate.variables.map(v => ({ name: v.name, value: v.value, type: v.type })),
      trigger: aggregate.trigger ? { type: aggregate.trigger.type, configuration: aggregate.trigger.configuration } : null,
      retryConfig: aggregate.retryConfig ? { strategy: aggregate.retryConfig.strategy, attempts: aggregate.retryConfig.attempts, delay: aggregate.retryConfig.delay } : null,
      timeoutConfig: aggregate.timeoutConfig ? { value: aggregate.timeoutConfig.value, unit: aggregate.timeoutConfig.unit } : null,
      executionPlan: aggregate.executionPlan || null,
      version: aggregate.version,
      isDeleted: aggregate.isDeleted,
      deletedAt: aggregate.deletedAt || null,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
