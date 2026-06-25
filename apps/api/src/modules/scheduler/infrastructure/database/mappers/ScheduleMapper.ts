import { Injectable } from '@nestjs/common';
import { Schedule as PrismaSchedule } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { Schedule, ScheduleProps } from '../../../domain/aggregates/Schedule';
import { ScheduleId } from '../../../domain/value-objects/ScheduleId';
import { ScheduleStatus } from '../../../domain/enums/ScheduleStatus';
import { SchedulingPolicy } from '../../../domain/value-objects/SchedulingPolicy';
import { PriorityPolicy } from '../../../domain/value-objects/PriorityPolicy';
import { ConcurrencyPolicy } from '../../../domain/value-objects/ConcurrencyPolicy';
import { ConcurrencyLimit } from '../../../domain/value-objects/ConcurrencyLimit';

@Injectable()
export class ScheduleMapper
  implements
    AggregateMapper<Schedule, ScheduleId, PrismaSchedule>,
    PersistenceMapper<Schedule, ScheduleId, PrismaSchedule>
{
  toDomain(model: PrismaSchedule): Schedule {
    const sp = model.schedulingPolicy as any;
    const pp = model.priorityPolicy as any;
    const cp = model.concurrencyPolicy as any;

    const props: ScheduleProps = {
      workspaceRef: model.workspaceRef,
      status: model.status as ScheduleStatus,
      schedulingPolicy: sp.type === 'cron' ? SchedulingPolicy.createCron(
        sp.expression,
        undefined,
        undefined
      ) : SchedulingPolicy.createImmediate(),
      priorityPolicy: PriorityPolicy.create(
        pp.basePriority,
        pp.boostOnRetry ?? false
      ),
      concurrencyPolicy: cp ? ConcurrencyPolicy.create(
        (ConcurrencyLimit as any).create(cp.limit?.maxConcurrent || 100),
        cp.queueIfFull ?? true
      ) : undefined,
      lastRunAt: model.lastRunAt ?? undefined,
      nextRunAt: model.nextRunAt ?? undefined,
    };

    const schedule = (Schedule as any).create(props, ScheduleId.create(model.id)); // Using any bypass since create initializes status to Active
    (schedule as any).props.status = model.status;
    (schedule as any)['_version'] = model.version;
    schedule.clearDomainEvents();
    return schedule;
  }

  toPersistence(aggregate: Schedule): PrismaSchedule {
    const version = (aggregate as any)['_version'] || 1;

    return {
      id: aggregate.id.value,
      workspaceRef: aggregate.workspaceRef,
      status: aggregate.status,
      schedulingPolicy: {
        type: aggregate.schedulingPolicy.strategy,
        expression: aggregate.schedulingPolicy.expression,
      } as any,
      priorityPolicy: {
        basePriority: aggregate.priorityPolicy.basePriority,
        boostOnRetry: aggregate.priorityPolicy.boostOnRetry,
      } as any,
      concurrencyPolicy: aggregate.concurrencyPolicy ? {
        limit: {
          maxConcurrent: aggregate.concurrencyPolicy.limit.maxConcurrent,
        },
        queueIfFull: aggregate.concurrencyPolicy.queueIfFull,
      } as any : null,
      lastRunAt: aggregate.lastRunAt ?? null,
      nextRunAt: aggregate.nextRunAt ?? null,
      version: version,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
