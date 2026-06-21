import { AggregateRoot } from '@rrss-auto/domain';
import { JobId } from '../value-objects/JobId';
import { JobStatus, TERMINAL_JOB_STATUSES } from '../enums/JobStatus';
import { ExecutionPriority } from '../enums/ExecutionPriority';
import { InvalidJobTransitionException } from '../exceptions/InvalidJobTransitionException';
import { JobAlreadyClaimedException } from '../exceptions/JobAlreadyClaimedException';
import { JobCreated } from '../domain-events/JobCreated';
import { JobEnqueued } from '../domain-events/JobEnqueued';
import { JobClaimed } from '../domain-events/JobClaimed';
import { JobTimedOut } from '../domain-events/JobTimedOut';
import { JobDeadLettered } from '../domain-events/JobDeadLettered';
import { JobAcknowledged } from '../domain-events/JobAcknowledged';

export interface JobProps {
  executionId: string;
  stepId?: string;
  workspaceRef: string;
  status: JobStatus;
  priority: ExecutionPriority;
  queue: string;
  claimedByWorkerId?: string;
  claimedAt?: Date;
  attempts: number;
  maxAttempts: number;
  enqueuedAt?: Date;
  leaseExpiresAt?: Date;
}

/**
 * Job – schedulable/queueable unit of work.
 *
 * RFC-0001: "A Job is what the Scheduler and queues understand.
 *            An Execution can produce one or several Jobs."
 *
 * Separation from Execution allows:
 * - long Executions split into multiple Jobs;
 * - failed Jobs without destroying Execution history;
 * - Scheduler reprogramming without changing original intent.
 */
export class Job extends AggregateRoot<JobProps, JobId> {
  private constructor(props: JobProps, id: JobId) {
    super(props, id);
  }

  get executionId(): string { return this.props.executionId; }
  get stepId(): string | undefined { return this.props.stepId; }
  get workspaceRef(): string { return this.props.workspaceRef; }
  get status(): JobStatus { return this.props.status; }
  get priority(): ExecutionPriority { return this.props.priority; }
  get queue(): string { return this.props.queue; }
  get claimedByWorkerId(): string | undefined { return this.props.claimedByWorkerId; }
  get claimedAt(): Date | undefined { return this.props.claimedAt; }
  get attempts(): number { return this.props.attempts; }
  get maxAttempts(): number { return this.props.maxAttempts; }
  get enqueuedAt(): Date | undefined { return this.props.enqueuedAt; }
  get leaseExpiresAt(): Date | undefined { return this.props.leaseExpiresAt; }
  get isTerminal(): boolean { return TERMINAL_JOB_STATUSES.includes(this.props.status); }

  public static initialize(props: JobProps, id: JobId): Job {
    return new Job(props, id);
  }

  public static createNew(props: Omit<JobProps, 'status' | 'attempts'>, id: JobId): Job {
    const job = new Job({
      ...props,
      status: JobStatus.Created,
      attempts: 0,
    }, id);
    job.addDomainEvent(new JobCreated(id, props.executionId, props.workspaceRef));
    return job;
  }

  // ─── Transitions ────────────────────────────────────────────────────────────

  public ready(): void {
    this.guardTransition(JobStatus.Ready, [JobStatus.Created]);
    this.props.status = JobStatus.Ready;
  }

  public enqueue(): void {
    this.guardTransition(JobStatus.Enqueued, [JobStatus.Ready, JobStatus.TimedOut]);
    this.props.status = JobStatus.Enqueued;
    this.props.enqueuedAt = new Date();
    this.addDomainEvent(new JobEnqueued(this.id, this.props.executionId, this.props.queue));
  }

  public claim(workerId: string, leaseDurationMs: number = 60_000): void {
    if (this.props.status === JobStatus.Claimed || this.props.status === JobStatus.LeaseActive) {
      throw new JobAlreadyClaimedException(`Job '${this.id.value}' is already claimed by worker '${this.props.claimedByWorkerId}'`);
    }
    this.guardTransition(JobStatus.Claimed, [JobStatus.Enqueued]);
    this.props.status = JobStatus.Claimed;
    this.props.claimedByWorkerId = workerId;
    this.props.claimedAt = new Date();
    this.props.leaseExpiresAt = new Date(Date.now() + leaseDurationMs);
    this.props.attempts += 1;
    this.addDomainEvent(new JobClaimed(this.id, workerId));
  }

  public activateLease(): void {
    this.guardTransition(JobStatus.LeaseActive, [JobStatus.Claimed]);
    this.props.status = JobStatus.LeaseActive;
  }

  public acknowledge(workerId: string): void {
    this.guardTransition(JobStatus.Acknowledged, [JobStatus.LeaseActive]);
    this.props.status = JobStatus.Acknowledged;
    this.addDomainEvent(new JobAcknowledged(this.id, workerId));
  }

  public timeout(): void {
    if (this.isTerminal) return; // idempotent on terminal
    this.guardTransition(JobStatus.TimedOut, [JobStatus.Claimed, JobStatus.LeaseActive]);
    this.props.status = JobStatus.TimedOut;
    this.addDomainEvent(new JobTimedOut(this.id, this.props.claimedByWorkerId ?? 'unknown'));
  }

  public deadLetter(reason: string): void {
    this.props.status = JobStatus.DeadLettered;
    this.addDomainEvent(new JobDeadLettered(this.id, reason, this.props.attempts));
  }

  private guardTransition(to: JobStatus, allowedFrom: JobStatus[]): void {
    if (!allowedFrom.includes(this.props.status)) {
      throw new InvalidJobTransitionException(
        `Cannot transition Job '${this.id.value}' from '${this.props.status}' to '${to}'`
      );
    }
  }
}
