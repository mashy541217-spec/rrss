import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { Scheduler } from '../../../domain/aggregates/Scheduler';
import { SchedulerId } from '../../../domain/value-objects/SchedulerId';
import { SchedulerMapper } from '../mappers/SchedulerMapper';
import { Scheduler as PrismaScheduler } from '@prisma/client';

export interface ISchedulerRepository {
  findById(id: SchedulerId, scope?: TransactionScope): Promise<Scheduler | null>;
  save(scheduler: Scheduler, scope: TransactionScope): Promise<void>;
}

@Injectable()
export class PrismaSchedulerRepository
  extends BasePrismaRepository<Scheduler, SchedulerId, PrismaScheduler>
  implements ISchedulerRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: SchedulerMapper
  ) {
    super(mapper, mapper);
  }

  async findById(id: SchedulerId, scope?: TransactionScope): Promise<Scheduler | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.scheduler.findUnique({
      where: { id: id.value }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async save(scheduler: Scheduler, scope: TransactionScope): Promise<void> {
    await this.saveWithEvents(scheduler, scope, async (tx, model) => {
      const existing = await tx.scheduler.findUnique({
        where: { id: model.id },
        select: { version: true }
      });

      const newVersion = model.version + 1;
      model.version = newVersion;
      (scheduler as any)['_version'] = newVersion;

      if (!existing) {
        await tx.scheduler.create({ data: model });
      } else {
        if (existing.version !== model.version - 1) {
          throw new ConcurrencyException(`Scheduler ${model.id} was modified by another transaction.`);
        }
        await tx.scheduler.update({
          where: { id: model.id },
          data: model
        });
      }
    });
  }
}
