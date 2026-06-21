import { AggregateRoot } from '@rrss-auto/domain';
import { ExecutionId } from '../value-objects/ExecutionId';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { IdempotencyKey } from '../value-objects/IdempotencyKey';
import { RetryPolicy } from '../value-objects/RetryPolicy';
import { ExecutionTimeline } from '../value-objects/ExecutionTimeline';
import { TimelineEntry } from '../value-objects/TimelineEntry';
import { FailureClassification } from '../value-objects/FailureClassification';
import { CapabilityRequirement } from '../value-objects/CapabilityRequirement';
import { ExecutionContext } from '../value-objects/ExecutionContext';
import { ExecutionStatus, TERMINAL_EXECUTION_STATUSES } from '../enums/ExecutionStatus';
import { InvalidExecutionTransitionException } from '../exceptions/InvalidExecutionTransitionException';
import { ExecutionAlreadyCompletedException } from '../exceptions/ExecutionAlreadyCompletedException';
import { ExecutionAlreadyCancelledException } from '../exceptions/ExecutionAlreadyCancelledException';
import { MaxRetriesExceededException } from '../exceptions/MaxRetriesExceededException';
import { ExecutionRequested } from '../domain-events/ExecutionRequested';
import { ExecutionAccepted } from '../domain-events/ExecutionAccepted';
import { ExecutionRejected } from '../domain-events/ExecutionRejected';
import { ExecutionPlanned } from '../domain-events/ExecutionPlanned';
import { ExecutionScheduled } from '../domain-events/ExecutionScheduled';
import { ExecutionQueued } from '../domain-events/ExecutionQueued';
import { ExecutionStarted } from '../domain-events/ExecutionStarted';
import { ExecutionWaitingForResources } from '../domain-events/ExecutionWaitingForResources';
import { ExecutionWaitingExternal } from '../domain-events/ExecutionWaitingExternal';
import { ExecutionRetryScheduled } from '../domain-events/ExecutionRetryScheduled';
import { ExecutionCompleted } from '../domain-events/ExecutionCompleted';
import { ExecutionFailed } from '../domain-events/ExecutionFailed';
import { ExecutionCancelled } from '../domain-events/ExecutionCancelled';
import { ExecutionArchived } from '../domain-events/ExecutionArchived';

export interface ExecutionProps {
  context: ExecutionContext;
  workspaceRef: WorkspaceRef;
  idempotencyKey: IdempotencyKey;
  status: ExecutionStatus;
  retryPolicy: RetryPolicy;
  timeline: ExecutionTimeline;
  attemptsMade: number;
  totalSteps: number;
  completedSteps: number;
  assignedWorkerId?: string;
  failure?: FailureClassification;
  capabilities: ReadonlyArray<CapabilityRequirement>;
}

/**
 * Execution – central aggregate of the Execution Engine.
 *
 * RFC-0001: "An Execution is an auditable, idempotent and recoverable operational unit."
 *
 * Invariants:
 * - Transitions must follow the strict state machine.
 * - Terminal states are immutable.
 * - All transitions emit domain events.
 * - Retry respects RetryPolicy.
 */
export class Execution extends AggregateRoot<ExecutionProps, ExecutionId> {
  private constructor(props: ExecutionProps, id: ExecutionId) {
    super(props, id);
  }

  // ─── Getters ────────────────────────────────────────────────────────────────
  get context(): ExecutionContext { return this.props.context; }
  get workspaceRef(): WorkspaceRef { return this.props.workspaceRef; }
  get idempotencyKey(): IdempotencyKey { return this.props.idempotencyKey; }
  get status(): ExecutionStatus { return this.props.status; }
  get retryPolicy(): RetryPolicy { return this.props.retryPolicy; }
  get timeline(): ExecutionTimeline { return this.props.timeline; }
  get attemptsMade(): number { return this.props.attemptsMade; }
  get totalSteps(): number { return this.props.totalSteps; }
  get completedSteps(): number { return this.props.completedSteps; }
  get assignedWorkerId(): string | undefined { return this.props.assignedWorkerId; }
  get failure(): FailureClassification | undefined { return this.props.failure; }
  get capabilities(): ReadonlyArray<CapabilityRequirement> { return this.props.capabilities; }
  get isTerminal(): boolean { return TERMINAL_EXECUTION_STATUSES.includes(this.props.status); }

  // ─── Factories ──────────────────────────────────────────────────────────────
  public static initialize(props: ExecutionProps, id: ExecutionId): Execution {
    return new Execution(props, id);
  }

  public static request(
    props: Omit<ExecutionProps, 'status' | 'timeline' | 'attemptsMade' | 'totalSteps' | 'completedSteps'>,
    id: ExecutionId,
  ): Execution {
    const execution = new Execution({
      ...props,
      status: ExecutionStatus.Requested,
      timeline: ExecutionTimeline.EMPTY,
      attemptsMade: 0,
      totalSteps: 0,
      completedSteps: 0,
    }, id);
    execution.addDomainEvent(new ExecutionRequested(
      id,
      props.workspaceRef.value,
      props.context.actor,
      props.context.intent,
      props.context.priority,
      props.idempotencyKey.value,
    ));
    return execution;
  }

  // ─── State Transitions ──────────────────────────────────────────────────────

  public accept(): void {
    this.guardNotTerminal('accept');
    this.guardTransition(ExecutionStatus.Accepted, [ExecutionStatus.Requested]);
    this.props.status = ExecutionStatus.Accepted;
    this.appendTimeline(ExecutionStatus.Accepted, 'Execution accepted');
    this.addDomainEvent(new ExecutionAccepted(this.id));
  }

  public reject(reason: string): void {
    this.guardTransition(ExecutionStatus.Rejected, [ExecutionStatus.Requested]);
    this.props.status = ExecutionStatus.Rejected;
    this.appendTimeline(ExecutionStatus.Rejected, reason);
    this.addDomainEvent(new ExecutionRejected(this.id, reason));
  }

  public plan(stepCount: number): void {
    this.guardNotTerminal('plan');
    this.guardTransition(ExecutionStatus.Planned, [ExecutionStatus.Accepted]);
    if (stepCount < 1) throw new InvalidExecutionTransitionException('Execution must have at least 1 step');
    this.props.totalSteps = stepCount;
    this.props.status = ExecutionStatus.Planned;
    this.appendTimeline(ExecutionStatus.Planned, `Planned with ${stepCount} steps`);
    this.addDomainEvent(new ExecutionPlanned(this.id, stepCount));
  }

  public schedule(scheduledFor?: Date): void {
    this.guardNotTerminal('schedule');
    this.guardTransition(ExecutionStatus.Scheduled, [ExecutionStatus.Planned, ExecutionStatus.Retrying]);
    this.props.status = ExecutionStatus.Scheduled;
    this.appendTimeline(ExecutionStatus.Scheduled, scheduledFor ? `Scheduled for ${scheduledFor.toISOString()}` : 'Scheduled immediately');
    this.addDomainEvent(new ExecutionScheduled(this.id, scheduledFor));
  }

  public enqueue(): void {
    this.guardNotTerminal('enqueue');
    this.guardTransition(ExecutionStatus.Queued, [
      ExecutionStatus.Scheduled,
      ExecutionStatus.WaitingForResources,
      ExecutionStatus.WaitingExternal,
    ]);
    this.props.status = ExecutionStatus.Queued;
    this.appendTimeline(ExecutionStatus.Queued, 'Queued for execution');
    this.addDomainEvent(new ExecutionQueued(this.id));
  }

  public start(workerId: string): void {
    this.guardNotTerminal('start');
    this.guardTransition(ExecutionStatus.Running, [ExecutionStatus.Queued, ExecutionStatus.LeasingResources]);
    this.props.status = ExecutionStatus.Running;
    this.props.assignedWorkerId = workerId;
    this.props.attemptsMade += 1;
    this.appendTimeline(ExecutionStatus.Running, `Started by worker ${workerId}`);
    this.addDomainEvent(new ExecutionStarted(this.id, workerId));
  }

  public waitForResources(reason: string): void {
    this.guardNotTerminal('waitForResources');
    this.guardTransition(ExecutionStatus.WaitingForResources, [ExecutionStatus.Queued, ExecutionStatus.LeasingResources]);
    this.props.status = ExecutionStatus.WaitingForResources;
    this.appendTimeline(ExecutionStatus.WaitingForResources, reason);
    this.addDomainEvent(new ExecutionWaitingForResources(this.id, reason));
  }

  public waitExternal(reason: string): void {
    this.guardNotTerminal('waitExternal');
    this.guardTransition(ExecutionStatus.WaitingExternal, [ExecutionStatus.Running]);
    this.props.status = ExecutionStatus.WaitingExternal;
    this.appendTimeline(ExecutionStatus.WaitingExternal, reason);
    this.addDomainEvent(new ExecutionWaitingExternal(this.id, reason));
  }

  public recordStepCompleted(): void {
    this.guardNotTerminal('recordStepCompleted');
    this.props.completedSteps += 1;
    if (this.props.completedSteps >= this.props.totalSteps) {
      this.complete();
    }
  }

  public complete(): void {
    if (this.props.status === ExecutionStatus.Completed) return; // idempotent
    this.guardNotTerminal('complete');
    this.props.status = ExecutionStatus.Completed;
    this.appendTimeline(ExecutionStatus.Completed, 'Execution completed successfully');
    this.addDomainEvent(new ExecutionCompleted(this.id));
  }

  public fail(failure: FailureClassification): void {
    if (this.props.status === ExecutionStatus.Failed) {
      throw new ExecutionAlreadyCompletedException(`Execution '${this.id.value}' has already failed`);
    }
    if (!failure.isRecoverable || !this.props.retryPolicy.allowsMoreAttempts(this.props.attemptsMade)) {
      this.props.failure = failure;
      this.props.status = ExecutionStatus.Failed;
      this.appendTimeline(ExecutionStatus.Failed, failure.reason);
      this.addDomainEvent(new ExecutionFailed(this.id, failure.type, failure.reason));
    } else {
      this.scheduleRetry(failure);
    }
  }

  public scheduleRetry(failure: FailureClassification): void {
    this.guardNotTerminal('scheduleRetry');
    if (!this.props.retryPolicy.allowsMoreAttempts(this.props.attemptsMade)) {
      throw new MaxRetriesExceededException(
        `Execution '${this.id.value}' has exceeded max retry attempts (${this.props.retryPolicy.maxAttempts})`
      );
    }
    const backoffMs = this.props.retryPolicy.computeBackoffMs(this.props.attemptsMade + 1);
    this.props.status = ExecutionStatus.Retrying;
    this.props.failure = failure;
    this.appendTimeline(ExecutionStatus.Retrying, `Retry ${this.props.attemptsMade + 1}: ${failure.reason}`);
    this.addDomainEvent(new ExecutionRetryScheduled(this.id, this.props.attemptsMade + 1, backoffMs));
  }

  public requestCancel(reason: string, cancelledBy: string): void {
    if (this.props.status === ExecutionStatus.Cancelled) {
      throw new ExecutionAlreadyCancelledException(`Execution '${this.id.value}' is already cancelled`);
    }
    this.guardNotTerminal('cancel');
    this.props.status = ExecutionStatus.Cancelled;
    this.appendTimeline(ExecutionStatus.Cancelled, `Cancelled by ${cancelledBy}: ${reason}`);
    this.addDomainEvent(new ExecutionCancelled(this.id, reason, cancelledBy));
  }

  public archive(): void {
    this.guardTransition(ExecutionStatus.Archived, [
      ExecutionStatus.Completed,
      ExecutionStatus.Failed,
      ExecutionStatus.Cancelled,
    ]);
    this.props.status = ExecutionStatus.Archived;
    this.appendTimeline(ExecutionStatus.Archived, 'Execution archived');
    this.addDomainEvent(new ExecutionArchived(this.id));
  }

  // ─── Guards ─────────────────────────────────────────────────────────────────

  private guardNotTerminal(operation: string): void {
    if (this.isTerminal) {
      throw new InvalidExecutionTransitionException(
        `Cannot perform '${operation}' on terminal Execution '${this.id.value}' (status: ${this.props.status})`
      );
    }
  }

  private guardTransition(to: ExecutionStatus, allowedFrom: ExecutionStatus[]): void {
    if (!allowedFrom.includes(this.props.status)) {
      throw new InvalidExecutionTransitionException(
        `Cannot transition from '${this.props.status}' to '${to}' for Execution '${this.id.value}'`
      );
    }
  }

  private appendTimeline(status: ExecutionStatus, message: string, actor?: string): void {
    const entry = TimelineEntry.create({ status, occurredAt: new Date(), message, actor });
    this.props.timeline = this.props.timeline.append(entry);
  }
}
