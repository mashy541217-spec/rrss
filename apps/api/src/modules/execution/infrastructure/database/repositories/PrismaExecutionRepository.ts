import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { Execution } from '../../../domain/aggregates/Execution';
import { ExecutionId } from '../../../domain/value-objects/ExecutionId';
import { ExecutionMapper, PrismaExecutionFull } from '../mappers/ExecutionMapper';

export interface IExecutionRepository {
  findById(id: ExecutionId, scope?: TransactionScope): Promise<Execution | null>;
  save(execution: Execution, scope: TransactionScope): Promise<void>;
}

@Injectable()
export class PrismaExecutionRepository
  extends BasePrismaRepository<Execution, ExecutionId, PrismaExecutionFull>
  implements IExecutionRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: ExecutionMapper
  ) {
    super(mapper, mapper);
  }

  async findById(id: ExecutionId, scope?: TransactionScope): Promise<Execution | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.execution.findUnique({
      where: { id: id.value },
      include: {
        metadata: true,
        timeline: true
      }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async save(execution: Execution, scope: TransactionScope): Promise<void> {
    await this.saveWithEvents(execution, scope, async (tx, model) => {
      const existing = await tx.execution.findUnique({
        where: { id: model.id },
        select: { version: true }
      });

      const newVersion = model.version + 1;
      model.version = newVersion;
      (execution as any)['_version'] = newVersion;

      // Separate scalar fields from nested relation objects to avoid Prisma rejecting
      // relation fields (executionId, etc.) at the root Execution table level.
      // metadata and timeline are always present when produced by toPersistence().
      const { metadata, timeline, ...scalarFields } = model;
      if (!metadata || !timeline) {
        throw new Error(`ExecutionMapper.toPersistence must always produce metadata and timeline`);
      }

      if (!existing) {
        // Insert
        await tx.execution.create({
          data: {
            ...scalarFields,
            metadata: {
              create: {
                actor: metadata.actor,
                intent: metadata.intent,
                priority: metadata.priority,
                capabilities: metadata.capabilities,
              }
            },
            timeline: {
              create: timeline.map(t => ({
                status: t.status,
                occurredAt: t.occurredAt,
                message: t.message,
                actor: t.actor,
              }))
            }
          }
        });
      } else {
        // Optimistic locking
        if (existing.version !== model.version - 1) {
          throw new ConcurrencyException(`Execution ${model.id} was modified by another transaction.`);
        }

        // Delete and recreate related records (append-only timeline replaced for simplicity)
        await tx.executionTimeline.deleteMany({ where: { executionId: model.id } });
        await tx.executionMetadata.deleteMany({ where: { executionId: model.id } });

        await tx.execution.update({
          where: { id: model.id },
          data: {
            ...scalarFields,
            metadata: {
              create: {
                actor: metadata.actor,
                intent: metadata.intent,
                priority: metadata.priority,
                capabilities: metadata.capabilities,
              }
            },
            timeline: {
              create: timeline.map(t => ({
                status: t.status,
                occurredAt: t.occurredAt,
                message: t.message,
                actor: t.actor,
              }))
            }
          }
        });
      }
    });
  }
}
