import { ExecutionStep, ExecutionStepProps } from '../../../../../../apps/api/src/modules/execution/domain/aggregates/ExecutionStep';
import { ExecutionStepId } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/ExecutionStepId';
import { IdempotencyKey } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/IdempotencyKey';
import { ExecutionStepStatus } from '../../../../../../apps/api/src/modules/execution/domain/enums/ExecutionStepStatus';
import { CapabilityType } from '../../../../../../apps/api/src/modules/execution/domain/enums/CapabilityType';
import { FailureClassification } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/FailureClassification';

export class ExecutionStepBuilder {
  private props: Partial<ExecutionStepProps> = {};
  private id: string = 'step-123';

  public static create(): ExecutionStepBuilder {
    return new ExecutionStepBuilder();
  }

  public withId(id: string): this { this.id = id; return this; }
  public withExecutionId(execId: string): this { this.props.executionId = execId; return this; }
  public withOrder(order: number): this { this.props.order = order; return this; }
  public withStatus(status: ExecutionStepStatus): this { this.props.status = status; return this; }
  public withIdempotencyKey(key: string): this { this.props.idempotencyKey = IdempotencyKey.create(key); return this; }
  public withOutput(output: string): this { this.props.output = output; return this; }
  public withFailure(failure: FailureClassification): this { this.props.failure = failure; return this; }
  public withRetryAttempts(attempts: number): this { this.props.retryAttempts = attempts; return this; }

  public build(): ExecutionStep {
    return ExecutionStep.initialize({
      executionId: this.props.executionId ?? 'exec-123',
      order: this.props.order ?? 1,
      name: this.props.name ?? 'Test Step',
      description: this.props.description ?? 'A step for testing',
      capabilityType: this.props.capabilityType ?? CapabilityType.Generic,
      idempotencyKey: this.props.idempotencyKey ?? IdempotencyKey.create('step-idemp-1234'),
      status: this.props.status ?? ExecutionStepStatus.Pending,
      retryAttempts: this.props.retryAttempts ?? 0,
      output: this.props.output,
      failure: this.props.failure,
      startedAt: this.props.startedAt,
      completedAt: this.props.completedAt,
    }, ExecutionStepId.create(this.id));
  }
}
