import { AggregateRoot } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';
import { WorkerCapability } from '../value-objects/WorkerCapability';
import { HeartbeatInfo } from '../value-objects/HeartbeatInfo';
import { WorkerStatus } from '../enums/WorkerStatus';
import { CapabilityType } from '../enums/CapabilityType';
import { InvalidWorkerTransitionException } from '../exceptions/InvalidWorkerTransitionException';
import { WorkerRegistered } from '../domain-events/WorkerRegistered';
import { WorkerHeartbeatReceived } from '../domain-events/WorkerHeartbeatReceived';
import { WorkerHeartbeatMissed } from '../domain-events/WorkerHeartbeatMissed';
import { WorkerStartedDraining } from '../domain-events/WorkerStartedDraining';
import { WorkerStopped } from '../domain-events/WorkerStopped';

export interface WorkerProps {
  hostname: string;
  status: WorkerStatus;
  capabilities: ReadonlyArray<WorkerCapability>;
  heartbeat?: HeartbeatInfo;
  currentJobId?: string;
  registeredAt: Date;
  concurrencyLimit: number;
  activeJobCount: number;
}

/**
 * Worker – registered executor in the Worker Fleet.
 *
 * RFC-0001 responsibilities:
 * - Register with capabilities
 * - Claim compatible jobs
 * - Emit heartbeats
 * - Reserve resources via Resource Broker
 * - Execute steps
 * - Report events
 * - Release resources
 * - Drain gracefully
 *
 * Worker does NOT decide global policies or priorities.
 */
export class Worker extends AggregateRoot<WorkerProps, WorkerId> {
  private constructor(props: WorkerProps, id: WorkerId) {
    super(props, id);
  }

  get hostname(): string { return this.props.hostname; }
  get status(): WorkerStatus { return this.props.status; }
  get capabilities(): ReadonlyArray<WorkerCapability> { return this.props.capabilities; }
  get heartbeat(): HeartbeatInfo | undefined { return this.props.heartbeat; }
  get currentJobId(): string | undefined { return this.props.currentJobId; }
  get registeredAt(): Date { return this.props.registeredAt; }
  get concurrencyLimit(): number { return this.props.concurrencyLimit; }
  get activeJobCount(): number { return this.props.activeJobCount; }

  get isAvailable(): boolean {
    return this.props.status === WorkerStatus.Idle
      && this.props.activeJobCount < this.props.concurrencyLimit;
  }

  get isHealthy(): boolean {
    return this.props.status !== WorkerStatus.Unhealthy
      && this.props.status !== WorkerStatus.Stopped;
  }

  public static initialize(props: WorkerProps, id: WorkerId): Worker {
    return new Worker(props, id);
  }

  public static register(
    props: Omit<WorkerProps, 'status' | 'registeredAt' | 'activeJobCount'>,
    id: WorkerId,
  ): Worker {
    const worker = new Worker({
      ...props,
      status: WorkerStatus.Registering,
      registeredAt: new Date(),
      activeJobCount: 0,
    }, id);
    worker.addDomainEvent(new WorkerRegistered(id, props.capabilities, props.hostname));
    return worker;
  }

  // ─── Transitions ────────────────────────────────────────────────────────────

  public goIdle(): void {
    this.guardHealthy('goIdle');
    this.props.status = WorkerStatus.Idle;
    this.props.currentJobId = undefined;
  }

  public startPolling(): void {
    this.guardHealthy('poll');
    this.guardTransition(WorkerStatus.Polling, [WorkerStatus.Idle]);
    this.props.status = WorkerStatus.Polling;
  }

  public claimJob(jobId: string): void {
    this.guardHealthy('claimJob');
    this.guardTransition(WorkerStatus.ClaimedJob, [WorkerStatus.Polling, WorkerStatus.Idle]);
    this.props.status = WorkerStatus.ClaimedJob;
    this.props.currentJobId = jobId;
    this.props.activeJobCount += 1;
  }

  public startLeasing(): void {
    this.guardHealthy('leaseResources');
    this.guardTransition(WorkerStatus.LeasingResources, [WorkerStatus.ClaimedJob]);
    this.props.status = WorkerStatus.LeasingResources;
  }

  public startExecuting(): void {
    this.guardHealthy('execute');
    this.guardTransition(WorkerStatus.Executing, [WorkerStatus.LeasingResources]);
    this.props.status = WorkerStatus.Executing;
  }

  public startReporting(): void {
    this.guardHealthy('report');
    this.guardTransition(WorkerStatus.Reporting, [WorkerStatus.Executing]);
    this.props.status = WorkerStatus.Reporting;
  }

  public releaseResources(): void {
    this.guardHealthy('release');
    this.guardTransition(WorkerStatus.ReleasingResources, [WorkerStatus.Reporting]);
    this.props.status = WorkerStatus.ReleasingResources;
    if (this.props.activeJobCount > 0) this.props.activeJobCount -= 1;
  }

  public receiveHeartbeat(now: Date = new Date()): void {
    this.props.heartbeat = this.props.heartbeat
      ? this.props.heartbeat.renew(now)
      : HeartbeatInfo.create(now);
    this.addDomainEvent(new WorkerHeartbeatReceived(this.id, now));
  }

  public markHeartbeatMissed(): void {
    this.addDomainEvent(new WorkerHeartbeatMissed(this.id, this.props.heartbeat?.lastHeartbeatAt ?? new Date(), this.props.currentJobId));
  }

  public drain(): void {
    if (this.props.status === WorkerStatus.Draining) return; // idempotent
    this.props.status = WorkerStatus.Draining;
    this.addDomainEvent(new WorkerStartedDraining(this.id));
  }

  public stop(reason: string): void {
    if (this.props.status === WorkerStatus.Stopped) return; // idempotent
    this.props.status = WorkerStatus.Stopped;
    this.props.currentJobId = undefined;
    this.addDomainEvent(new WorkerStopped(this.id, reason));
  }

  public markUnhealthy(): void {
    this.props.status = WorkerStatus.Unhealthy;
  }

  // ─── Capability helpers ──────────────────────────────────────────────────────

  public supportsCapability(type: CapabilityType): boolean {
    return this.props.capabilities.some((c) => c.satisfies({ type }));
  }

  // ─── Guards ─────────────────────────────────────────────────────────────────

  private guardHealthy(operation: string): void {
    if (!this.isHealthy) {
      throw new InvalidWorkerTransitionException(
        `Cannot perform '${operation}' on unhealthy/stopped worker '${this.id.value}'`
      );
    }
  }

  private guardTransition(to: WorkerStatus, allowedFrom: WorkerStatus[]): void {
    if (!allowedFrom.includes(this.props.status)) {
      throw new InvalidWorkerTransitionException(
        `Cannot transition Worker '${this.id.value}' from '${this.props.status}' to '${to}'`
      );
    }
  }
}
