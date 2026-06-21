import { AggregateRoot } from '@rrss-auto/domain';
import { ExecutionStepId } from '../value-objects/ExecutionStepId';
import { IdempotencyKey } from '../value-objects/IdempotencyKey';
import { FailureClassification } from '../value-objects/FailureClassification';
import { ExecutionStepStatus, TERMINAL_STEP_STATUSES } from '../enums/ExecutionStepStatus';
import { CapabilityType } from '../enums/CapabilityType';
import { InvalidStepTransitionException } from '../exceptions/InvalidStepTransitionException';
import { StepAlreadyCompletedException } from '../exceptions/StepAlreadyCompletedException';
import { ExecutionStepStarted } from '../domain-events/ExecutionStepStarted';
import { ExecutionStepCompleted } from '../domain-events/ExecutionStepCompleted';
import { ExecutionStepFailed } from '../domain-events/ExecutionStepFailed';

export interface ExecutionStepProps {
  executionId: string;
  order: number;
  name: string;
  description: string;
  capabilityType: CapabilityType;
  idempotencyKey: IdempotencyKey;
  status: ExecutionStepStatus;
  output?: string;
  failure?: FailureClassification;
  retryAttempts: number;
  startedAt?: Date;
  completedAt?: Date;
}

/**
 * ExecutionStep – atomic unit of advance within an Execution.
 *
 * RFC-0001: "A Step must have its own state for partial retries,
 *            recovery and diagnosis. Each Step that can cause an
 *            external effect must have its own idempotency key."
 *
 * Invariants:
 * - Idempotency key is immutable.
 * - Terminal states cannot be re-entered.
 * - Only Running steps can complete or fail.
 */
export class ExecutionStep extends AggregateRoot<ExecutionStepProps, ExecutionStepId> {
  private constructor(props: ExecutionStepProps, id: ExecutionStepId) {
    super(props, id);
  }

  get executionId(): string { return this.props.executionId; }
  get order(): number { return this.props.order; }
  get name(): string { return this.props.name; }
  get description(): string { return this.props.description; }
  get capabilityType(): CapabilityType { return this.props.capabilityType; }
  get idempotencyKey(): IdempotencyKey { return this.props.idempotencyKey; }
  get status(): ExecutionStepStatus { return this.props.status; }
  get output(): string | undefined { return this.props.output; }
  get failure(): FailureClassification | undefined { return this.props.failure; }
  get retryAttempts(): number { return this.props.retryAttempts; }
  get startedAt(): Date | undefined { return this.props.startedAt; }
  get completedAt(): Date | undefined { return this.props.completedAt; }
  get isTerminal(): boolean { return TERMINAL_STEP_STATUSES.includes(this.props.status); }

  public static initialize(props: ExecutionStepProps, id: ExecutionStepId): ExecutionStep {
    return new ExecutionStep(props, id);
  }

  public static createNew(props: Omit<ExecutionStepProps, 'status' | 'retryAttempts'>, id: ExecutionStepId): ExecutionStep {
    return new ExecutionStep({
      ...props,
      status: ExecutionStepStatus.Pending,
      retryAttempts: 0,
    }, id);
  }

  // ─── Transitions ────────────────────────────────────────────────────────────

  public start(): void {
    this.guardNotTerminal('start');
    if (this.props.status !== ExecutionStepStatus.Pending && this.props.status !== ExecutionStepStatus.Retrying) {
      throw new InvalidStepTransitionException(
        `Cannot start step '${this.id.value}' from status '${this.props.status}'`
      );
    }
    this.props.status = ExecutionStepStatus.Running;
    this.props.startedAt = new Date();
    this.addDomainEvent(new ExecutionStepStarted(
      { value: this.props.executionId } as any,
      this.id.value,
      this.props.order,
    ));
  }

  public complete(output?: string): void {
    if (this.props.status === ExecutionStepStatus.Completed) {
      throw new StepAlreadyCompletedException(`Step '${this.id.value}' is already completed`);
    }
    this.guardNotTerminal('complete');
    if (this.props.status !== ExecutionStepStatus.Running) {
      throw new InvalidStepTransitionException(
        `Cannot complete step '${this.id.value}' from status '${this.props.status}'`
      );
    }
    this.props.status = ExecutionStepStatus.Completed;
    this.props.output = output;
    this.props.completedAt = new Date();
    this.addDomainEvent(new ExecutionStepCompleted(
      { value: this.props.executionId } as any,
      this.id.value,
      this.props.order,
      output,
    ));
  }

  public fail(failure: FailureClassification): void {
    this.guardNotTerminal('fail');
    if (this.props.status !== ExecutionStepStatus.Running) {
      throw new InvalidStepTransitionException(
        `Cannot fail step '${this.id.value}' from status '${this.props.status}'`
      );
    }
    this.props.failure = failure;
    this.props.status = ExecutionStepStatus.Failed;
    this.props.completedAt = new Date();
    this.addDomainEvent(new ExecutionStepFailed(
      { value: this.props.executionId } as any,
      this.id.value,
      failure.type,
      failure.reason,
    ));
  }

  public markRetrying(): void {
    this.guardNotTerminal('markRetrying');
    if (this.props.status !== ExecutionStepStatus.Failed) {
      throw new InvalidStepTransitionException(
        `Cannot retry step '${this.id.value}' from status '${this.props.status}'`
      );
    }
    this.props.status = ExecutionStepStatus.Retrying;
    this.props.retryAttempts += 1;
  }

  public skip(): void {
    if (this.props.status === ExecutionStepStatus.Skipped) return; // idempotent
    this.guardNotTerminal('skip');
    this.props.status = ExecutionStepStatus.Skipped;
    this.props.completedAt = new Date();
  }

  private guardNotTerminal(operation: string): void {
    if (this.isTerminal) {
      throw new InvalidStepTransitionException(
        `Cannot perform '${operation}' on terminal step '${this.id.value}' (status: ${this.props.status})`
      );
    }
  }
}
