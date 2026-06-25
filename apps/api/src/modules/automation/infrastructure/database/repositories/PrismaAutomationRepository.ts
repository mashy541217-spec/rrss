import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { ConcurrencyException } from '../../../../../infrastructure/database/traits/OptimisticLock';
import { Automation } from '../../../domain/aggregate/Automation';
import { AutomationId } from '../../../domain/value-objects/AutomationId';
import { IAutomationRepository } from '../../../domain/repositories/IAutomationRepository';
import { AutomationMapper } from '../mappers/AutomationMapper';

@Injectable()
export class PrismaAutomationRepository
  extends BasePrismaRepository<Automation, AutomationId, any>
  implements IAutomationRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: AutomationMapper
  ) {
    super(mapper, mapper);
  }

  public async save(automation: Automation): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const scope = new TransactionScope(tx);

      await this.saveWithEvents(automation, scope, async (transactionClient, model) => {
        const existing = await transactionClient.automation.findUnique({
          where: { id: model.id },
        });

        const updatedVersion = existing ? model.version + 1 : model.version;

        if (!existing) {
          await transactionClient.automation.create({
            data: {
              id: model.id,
              workspaceRef: model.workspaceRef,
              name: model.name,
              description: model.description,
              status: model.status,
              variables: model.variables,
              trigger: model.trigger,
              retryConfig: model.retryConfig,
              timeoutConfig: model.timeoutConfig,
              executionPlan: model.executionPlan,
              version: model.version,
              isDeleted: model.isDeleted,
              createdAt: model.createdAt,
              updatedAt: model.updatedAt,
            },
          });
        } else {
          if (existing.version !== model.version) {
            throw new ConcurrencyException('Automation', model.id);
          }

          await transactionClient.automation.update({
            where: { id: model.id, version: model.version },
            data: {
              name: model.name,
              description: model.description,
              status: model.status,
              variables: model.variables,
              trigger: model.trigger,
              retryConfig: model.retryConfig,
              timeoutConfig: model.timeoutConfig,
              executionPlan: model.executionPlan,
              version: updatedVersion,
              isDeleted: model.isDeleted,
              deletedAt: model.deletedAt,
              updatedAt: new Date(),
            },
          });

          (automation as any)['props'].version = updatedVersion;
        }

        // Sync WorkflowNodes
        await transactionClient.workflowNode.deleteMany({
          where: { automationId: automation.id.value },
        });
        for (const node of automation.nodes) {
          await transactionClient.workflowNode.create({
            data: {
              id: node.id.value,
              automationId: automation.id.value,
              type: node.type,
              name: node.name,
              config: node.config || {},
              positionX: node.positionX,
              positionY: node.positionY,
            },
          });
        }

        // Sync WorkflowConnections
        await transactionClient.workflowConnection.deleteMany({
          where: { automationId: automation.id.value },
        });
        for (const conn of automation.connections) {
          await transactionClient.workflowConnection.create({
            data: {
              id: conn.id.value,
              automationId: automation.id.value,
              sourceId: conn.sourceId,
              targetId: conn.targetId,
              sourceHandle: conn.sourceHandle || null,
              targetHandle: conn.targetHandle || null,
              condition: conn.condition || null,
            },
          });
        }
      });
    });
  }

  public async findById(id: AutomationId): Promise<Automation | null> {
    const raw = await this.prisma.automation.findFirst({
      where: { id: id.value, isDeleted: false },
      include: {
        nodes: true,
        connections: true,
        versions: true,
        snapshots: true,
      },
    });

    if (!raw) return null;
    return this.aggregateMapper.toDomain(raw);
  }
}
