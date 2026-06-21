import { Job, JobProps } from '../aggregates/Job';
import { JobId } from '../value-objects/JobId';
import { ExecutionPriority } from '../enums/ExecutionPriority';

export interface CreateJobInput {
  rawId: string;
  executionId: string;
  stepId?: string;
  workspaceRef: string;
  priority?: ExecutionPriority;
  queue?: string;
  maxAttempts?: number;
}

export class JobFactory {
  public static create(input: CreateJobInput): Job {
    const id = JobId.create(input.rawId);
    const job = Job.createNew(
      {
        executionId: input.executionId,
        stepId: input.stepId,
        workspaceRef: input.workspaceRef,
        priority: input.priority ?? ExecutionPriority.Standard,
        queue: input.queue ?? 'workspace-standard',
        maxAttempts: input.maxAttempts ?? 3,
        claimedByWorkerId: undefined,
        claimedAt: undefined,
        enqueuedAt: undefined,
        leaseExpiresAt: undefined,
      },
      id,
    );
    return job;
  }

  public static reconstitute(props: JobProps, id: JobId): Job {
    return Job.initialize(props, id);
  }
}
