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

      if (!existing) {
        // Insert
        await tx.execution.create({
          data: {
            ...model,
            metadata: {
              create: model.metadata
            },
            timeline: {
              create: model.timeline
            }
          }
        });
      } else {
        // Optimistic locking
        if (existing.version !== model.version - 1) {
          throw new ConcurrencyException(`Execution ${model.id} was modified by another transaction.`);
        }

        // Update
        // For timeline, we assume append-only, but Prisma replace/create is tricky. We'll delete and recreate timeline for simplicity or just delete many.
        // In a real prod environment we'd append only the difference, but replacing is safer for the demo.
        await tx.executionTimeline.deleteMany({ where: { executionId: model.id } });
        
        // Similarly for metadata
        await tx.executionMetadata.deleteMany({ where: { executionId: model.id } });

        await tx.execution.update({
          where: { id: model.id },
          data: {
            ...model,
            metadata: {
              create: model.metadata
            },
            timeline: {
              create: model.timeline
            }
          }
        });
      }
    });
  }
}
