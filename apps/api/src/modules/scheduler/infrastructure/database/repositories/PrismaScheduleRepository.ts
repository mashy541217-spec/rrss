import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { Schedule } from '../../../domain/aggregates/Schedule';
import { ScheduleId } from '../../../domain/value-objects/ScheduleId';
import { ScheduleMapper } from '../mappers/ScheduleMapper';
import { Schedule as PrismaSchedule } from '@prisma/client';

export interface IScheduleRepository {
  findById(id: ScheduleId, scope?: TransactionScope): Promise<Schedule | null>;
  save(schedule: Schedule, scope: TransactionScope): Promise<void>;
}

@Injectable()
export class PrismaScheduleRepository
  extends BasePrismaRepository<Schedule, ScheduleId, PrismaSchedule>
  implements IScheduleRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: ScheduleMapper
  ) {
    super(mapper, mapper);
  }

  async findById(id: ScheduleId, scope?: TransactionScope): Promise<Schedule | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.schedule.findUnique({
      where: { id: id.value }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async save(schedule: Schedule, scope: TransactionScope): Promise<void> {
    await this.saveWithEvents(schedule, scope, async (tx, model) => {
      const existing = await tx.schedule.findUnique({
        where: { id: model.id },
        select: { version: true }
      });

      const newVersion = model.version + 1;
      model.version = newVersion;
      (schedule as any)['_version'] = newVersion;

      if (!existing) {
        await tx.schedule.create({ data: model });
      } else {
        if (existing.version !== model.version - 1) {
          throw new ConcurrencyException(`Schedule ${model.id} was modified by another transaction.`);
        }
        await tx.schedule.update({
          where: { id: model.id },
          data: model
        });
      }
    });
  }
}
