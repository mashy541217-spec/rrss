import { Injectable } from '@nestjs/common';
import { Scheduler as PrismaScheduler } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { Scheduler, SchedulerProps } from '../../../domain/aggregates/Scheduler';
import { SchedulerId } from '../../../domain/value-objects/SchedulerId';
import { SchedulerStatus } from '../../../domain/enums/SchedulerStatus';
import { ConcurrencyPolicy } from '../../../domain/value-objects/ConcurrencyPolicy';
import { WorkerSelectionPolicy } from '../../../domain/value-objects/WorkerSelectionPolicy';
import { PriorityPolicy } from '../../../domain/value-objects/PriorityPolicy';
import { RetrySchedulingPolicy } from '../../../domain/value-objects/RetrySchedulingPolicy';
import { ConcurrencyLimit } from '../../../domain/value-objects/ConcurrencyLimit';

@Injectable()
export class SchedulerMapper
  implements
    AggregateMapper<Scheduler, SchedulerId, PrismaScheduler>,
    PersistenceMapper<Scheduler, SchedulerId, PrismaScheduler>
{
  toDomain(model: PrismaScheduler): Scheduler {
    const cp = model.concurrencyPolicy as any;
    const wsp = model.workerSelectionPolicy as any;
    const pp = model.priorityPolicy as any;
    const rsp = model.retryPolicy as any;

    const props: SchedulerProps = {
      status: model.status as SchedulerStatus,
      concurrencyPolicy: ConcurrencyPolicy.create(
        (ConcurrencyLimit as any).create(cp.limit?.maxConcurrent || 100),
        cp.queueIfFull ?? true
      ),
      workerSelectionPolicy: WorkerSelectionPolicy.create({
        strategy: wsp.strategy,
        preferredWorkerIds: wsp.preferredWorkerIds ?? [],
        requiredWorkerTags: wsp.requiredWorkerTags ?? []
      }),
      priorityPolicy: PriorityPolicy.create(
        pp.basePriority,
        pp.boostOnRetry ?? false
      ),
      retryPolicy: RetrySchedulingPolicy.create(
        rsp.maxRetries || 3,
        (rsp.backoffStrategy as any)
      ),
    };

    const scheduler = Scheduler.initialize(props, SchedulerId.create(model.id));
    (scheduler as any)['_version'] = model.version;
    scheduler.clearDomainEvents();
    return scheduler;
  }

  toPersistence(aggregate: Scheduler): PrismaScheduler {
    const version = (aggregate as any)['_version'] || 1;

    return {
      id: aggregate.id.value,
      status: aggregate.status,
      concurrencyPolicy: {
        limit: {
          maxConcurrent: aggregate.concurrencyPolicy.limit.maxConcurrent,
        },
        queueIfFull: aggregate.concurrencyPolicy.queueIfFull,
      } as any,
      workerSelectionPolicy: {
        strategy: aggregate.workerSelectionPolicy.strategy,
        preferredWorkerIds: aggregate.workerSelectionPolicy.preferredWorkerIds,
        requiredWorkerTags: aggregate.workerSelectionPolicy.requiredWorkerTags,
      } as any,
      priorityPolicy: {
        basePriority: aggregate.priorityPolicy.basePriority,
        boostOnRetry: aggregate.priorityPolicy.boostOnRetry,
      } as any,
      retryPolicy: {
        maxRetries: aggregate.retryPolicy.maxRetries,
        backoffStrategy: aggregate.retryPolicy.backoff,
      } as any,
      version: version,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
