import { Injectable } from '@nestjs/common';
import { Job as PrismaJob, WorkerAssignment as PrismaWorkerAssignment } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { Job, JobProps } from '../../../domain/aggregates/Job';
import { JobId } from '../../../domain/value-objects/JobId';
import { JobStatus } from '../../../domain/enums/JobStatus';
import { ExecutionPriority } from '../../../domain/enums/ExecutionPriority';

export type PrismaJobFull = PrismaJob & {
  assignments?: PrismaWorkerAssignment[];
};

@Injectable()
export class JobMapper
  implements
    AggregateMapper<Job, JobId, PrismaJobFull>,
    PersistenceMapper<Job, JobId, PrismaJobFull>
{
  toDomain(model: PrismaJobFull): Job {
    const props: JobProps = {
      executionId: model.executionId,
      stepId: model.stepId ?? undefined,
      workspaceRef: model.workspaceRef,
      status: model.status as JobStatus,
      priority: model.priority as ExecutionPriority,
      queue: model.queue,
      claimedByWorkerId: model.claimedByWorkerId ?? undefined,
      claimedAt: model.claimedAt ?? undefined,
      attempts: model.attempts,
      maxAttempts: model.maxAttempts,
      enqueuedAt: model.enqueuedAt ?? undefined,
      leaseExpiresAt: model.leaseExpiresAt ?? undefined,
    };

    const job = Job.initialize(props, JobId.create(model.id));
    (job as any)['_version'] = model.version;
    job.clearDomainEvents();
    return job;
  }

  toPersistence(aggregate: Job): PrismaJobFull {
    const version = (aggregate as any)['_version'] || 1;

    let assignments: PrismaWorkerAssignment[] = [];
    if (aggregate.claimedByWorkerId && aggregate.leaseExpiresAt && aggregate.claimedAt) {
      assignments.push({
        id: '', // DB auto-generates
        jobId: aggregate.id.value,
        workerId: aggregate.claimedByWorkerId,
        claimedAt: aggregate.claimedAt,
        leaseExpiresAt: aggregate.leaseExpiresAt,
        status: aggregate.status === JobStatus.LeaseActive ? 'ACTIVE' : 
                (aggregate.status === JobStatus.TimedOut ? 'EXPIRED' : 
                (aggregate.status === JobStatus.Acknowledged ? 'COMPLETED' : 'FAILED')),
      });
    }

    return {
      id: aggregate.id.value,
      executionId: aggregate.executionId,
      stepId: aggregate.stepId ?? null,
      workspaceRef: aggregate.workspaceRef,
      status: aggregate.status,
      priority: aggregate.priority,
      queue: aggregate.queue,
      claimedByWorkerId: aggregate.claimedByWorkerId ?? null,
      claimedAt: aggregate.claimedAt ?? null,
      attempts: aggregate.attempts,
      maxAttempts: aggregate.maxAttempts,
      enqueuedAt: aggregate.enqueuedAt ?? null,
      leaseExpiresAt: aggregate.leaseExpiresAt ?? null,
      version: version,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignments: assignments.length > 0 ? assignments : undefined,
    };
  }
}
