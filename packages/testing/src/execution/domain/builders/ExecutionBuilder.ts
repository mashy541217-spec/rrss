import { Execution, ExecutionProps } from '../../../../../../apps/api/src/modules/execution/domain/aggregates/Execution';
import { ExecutionId } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/ExecutionId';
import { WorkspaceRef } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/WorkspaceRef';
import { IdempotencyKey } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/IdempotencyKey';
import { RetryPolicy } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/RetryPolicy';
import { ExecutionTimeline } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/ExecutionTimeline';
import { ExecutionContext } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/ExecutionContext';
import { FailureClassification } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/FailureClassification';
import { ExecutionStatus } from '../../../../../../apps/api/src/modules/execution/domain/enums/ExecutionStatus';
import { ExecutionPriority } from '../../../../../../apps/api/src/modules/execution/domain/enums/ExecutionPriority';
import { CapabilityRequirement } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/CapabilityRequirement';

export class ExecutionBuilder {
  private props: Partial<ExecutionProps> = {};
  private id: string = 'exec-123';

  public static create(): ExecutionBuilder {
    return new ExecutionBuilder();
  }

  public withId(id: string): this { this.id = id; return this; }
  public withStatus(status: ExecutionStatus): this { this.props.status = status; return this; }
  public withWorkspaceRef(ref: string): this { this.props.workspaceRef = WorkspaceRef.create(ref); return this; }
  public withIdempotencyKey(key: string): this { this.props.idempotencyKey = IdempotencyKey.create(key); return this; }
  public withRetryPolicy(policy: RetryPolicy): this { this.props.retryPolicy = policy; return this; }
  public withAttemptsMade(attempts: number): this { this.props.attemptsMade = attempts; return this; }
  public withTotalSteps(total: number): this { this.props.totalSteps = total; return this; }
  public withCompletedSteps(completed: number): this { this.props.completedSteps = completed; return this; }
  public withAssignedWorkerId(workerId: string): this { this.props.assignedWorkerId = workerId; return this; }
  public withFailure(failure: FailureClassification): this { this.props.failure = failure; return this; }
  public withContext(context: ExecutionContext): this { this.props.context = context; return this; }

  public build(): Execution {
    return Execution.initialize({
      context: this.props.context ?? ExecutionContext.create({
        workspaceRef: this.props.workspaceRef?.value ?? 'wksp-123',
        actor: 'user-123',
        intent: 'Test execution',
        priority: ExecutionPriority.Standard,
      }),
      workspaceRef: this.props.workspaceRef ?? WorkspaceRef.create('wksp-123'),
      idempotencyKey: this.props.idempotencyKey ?? IdempotencyKey.create('idemp-key-1234'),
      status: this.props.status ?? ExecutionStatus.Requested,
      retryPolicy: this.props.retryPolicy ?? RetryPolicy.DEFAULT,
      timeline: this.props.timeline ?? ExecutionTimeline.EMPTY,
      attemptsMade: this.props.attemptsMade ?? 0,
      totalSteps: this.props.totalSteps ?? 0,
      completedSteps: this.props.completedSteps ?? 0,
      assignedWorkerId: this.props.assignedWorkerId,
      failure: this.props.failure,
      capabilities: this.props.capabilities ?? [],
    }, ExecutionId.create(this.id));
  }
}
