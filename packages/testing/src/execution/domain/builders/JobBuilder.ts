import { Job, JobProps } from '../../../../../../apps/api/src/modules/execution/domain/aggregates/Job';
import { JobId } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/JobId';
import { JobStatus } from '../../../../../../apps/api/src/modules/execution/domain/enums/JobStatus';
import { ExecutionPriority } from '../../../../../../apps/api/src/modules/execution/domain/enums/ExecutionPriority';

export class JobBuilder {
  private props: Partial<JobProps> = {};
  private id: string = 'job-123';

  public static create(): JobBuilder {
    return new JobBuilder();
  }

  public withId(id: string): this { this.id = id; return this; }
  public withExecutionId(execId: string): this { this.props.executionId = execId; return this; }
  public withStatus(status: JobStatus): this { this.props.status = status; return this; }
  public withWorkspaceRef(ref: string): this { this.props.workspaceRef = ref; return this; }
  public withClaimedByWorkerId(workerId: string): this { this.props.claimedByWorkerId = workerId; return this; }
  public withAttempts(attempts: number): this { this.props.attempts = attempts; return this; }

  public build(): Job {
    return Job.initialize({
      executionId: this.props.executionId ?? 'exec-123',
      stepId: this.props.stepId,
      workspaceRef: this.props.workspaceRef ?? 'wksp-123',
      status: this.props.status ?? JobStatus.Created,
      priority: this.props.priority ?? ExecutionPriority.Standard,
      queue: this.props.queue ?? 'default',
      claimedByWorkerId: this.props.claimedByWorkerId,
      claimedAt: this.props.claimedAt,
      attempts: this.props.attempts ?? 0,
      maxAttempts: this.props.maxAttempts ?? 3,
      enqueuedAt: this.props.enqueuedAt,
      leaseExpiresAt: this.props.leaseExpiresAt,
    }, JobId.create(this.id));
  }
}
