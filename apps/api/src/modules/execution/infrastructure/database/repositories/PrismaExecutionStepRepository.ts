import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { ExecutionStep } from '../../../domain/aggregates/ExecutionStep';
import { ExecutionStepId } from '../../../domain/value-objects/ExecutionStepId';
import { ExecutionStepMapper } from '../mappers/ExecutionStepMapper';
import { ExecutionStep as PrismaExecutionStep } from '@prisma/client';

export interface IExecutionStepRepository {
  findById(id: ExecutionStepId, scope?: TransactionScope): Promise<ExecutionStep | null>;
  save(step: ExecutionStep, scope: TransactionScope): Promise<void>;
}

@Injectable()
export class PrismaExecutionStepRepository
  extends BasePrismaRepository<ExecutionStep, ExecutionStepId, PrismaExecutionStep>
  implements IExecutionStepRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: ExecutionStepMapper
  ) {
    super(mapper, mapper);
  }

  async findById(id: ExecutionStepId, scope?: TransactionScope): Promise<ExecutionStep | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.executionStep.findUnique({
      where: { id: id.value }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async save(step: ExecutionStep, scope: TransactionScope): Promise<void> {
    await this.saveWithEvents(step, scope, async (tx, model) => {
      const existing = await tx.executionStep.findUnique({
        where: { id: model.id },
        select: { version: true }
      });

      const newVersion = model.version + 1;
      model.version = newVersion;
      (step as any)['_version'] = newVersion;

      if (!existing) {
        await tx.executionStep.create({ data: model });
      } else {
        if (existing.version !== model.version - 1) {
          throw new ConcurrencyException(`ExecutionStep ${model.id} was modified by another transaction.`);
        }
        await tx.executionStep.update({
          where: { id: model.id },
          data: model
        });
      }
    });
  }
}
