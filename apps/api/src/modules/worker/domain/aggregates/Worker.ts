import { AggregateRoot } from '@rrss-auto/domain';
import { WorkerId } from '../value-objects/WorkerId';
import { WorkerType } from '../enums/WorkerType';
import { WorkerEndpoint } from '../value-objects/WorkerEndpoint';
import { WorkerCapacity } from '../value-objects/WorkerCapacity';
import { WorkerStatus } from '../enums/WorkerStatus';
import { WorkerHealth } from '../enums/WorkerHealth';
import { ExecutionSlot } from '../value-objects/ExecutionSlot';
import { ExecutionAssignment } from './ExecutionAssignment';
import { WorkerHeartbeat } from './WorkerHeartbeat';
import { WorkerSession } from './WorkerSession';

import { WorkerRegistered } from '../domain-events/WorkerRegistered';
import { WorkerStarted } from '../domain-events/WorkerStarted';
import { WorkerStopped } from '../domain-events/WorkerStopped';
import { WorkerPaused } from '../domain-events/WorkerPaused';
import { WorkerResumed } from '../domain-events/WorkerResumed';
import { WorkerHeartbeatReceived } from '../domain-events/WorkerHeartbeatReceived';
import { ExecutionAssignedToWorker } from '../domain-events/ExecutionAssignedToWorker';
import { ExecutionCompletedByWorker } from '../domain-events/ExecutionCompletedByWorker';
import { ExecutionFailedByWorker } from '../domain-events/ExecutionFailedByWorker';

export interface WorkerProps {
  type: WorkerType;
  endpoint: WorkerEndpoint;
  capacity: WorkerCapacity;
  status: WorkerStatus;
  health: WorkerHealth;
  slots: ExecutionSlot[];
  assignments: ExecutionAssignment[];
  currentSession: WorkerSession | null;
  lastHeartbeat: WorkerHeartbeat | null;
}

export class Worker extends AggregateRoot<WorkerProps, WorkerId> {
  private constructor(props: WorkerProps, id: WorkerId) {
    super(props, id);
  }

  get type(): WorkerType { return this.props.type; }
  get status(): WorkerStatus { return this.props.status; }
  get health(): WorkerHealth { return this.props.health; }
  get capacity(): WorkerCapacity { return this.props.capacity; }
  get assignments(): ExecutionAssignment[] { return this.props.assignments; }

  public static register(id: WorkerId, type: WorkerType, endpoint: WorkerEndpoint, capacity: WorkerCapacity): Worker {
    const slots = Array.from({ length: capacity.maxConcurrentExecutions }, (_, i) => ExecutionSlot.createEmpty(i));
    
    const worker = new Worker({
      type,
      endpoint,
      capacity,
      status: WorkerStatus.Registered,
      health: WorkerHealth.Healthy,
      slots,
      assignments: [],
      currentSession: null,
      lastHeartbeat: null
    }, id);

    worker.addDomainEvent(new WorkerRegistered(id, type, endpoint));
    return worker;
  }

  public startSession(sessionId: string): void {
    if (this.props.currentSession?.isActive) {
      this.props.currentSession.terminate('Replaced by new session');
    }
    this.props.currentSession = WorkerSession.create(sessionId);
    this.props.status = WorkerStatus.Idle;
    this.addDomainEvent(new WorkerStarted(this.id));
  }

  public recordHeartbeat(health: WorkerHealth, currentLoad: number, uptimeSeconds: number): void {
    const hb = WorkerHeartbeat.create(health, currentLoad, uptimeSeconds);
    this.props.lastHeartbeat = hb;
    this.props.health = health;
    this.addDomainEvent(new WorkerHeartbeatReceived(this.id, health, currentLoad));
  }

  public assignExecution(executionId: string): void {
    if (this.props.status !== WorkerStatus.Idle && this.props.status !== WorkerStatus.Busy) {
      throw new Error('Worker cannot accept executions in current state');
    }

    const freeSlotIndex = this.props.slots.findIndex(s => !s.isOccupied);
    if (freeSlotIndex === -1) {
      throw new Error('Worker is at maximum capacity');
    }

    this.props.slots[freeSlotIndex] = this.props.slots[freeSlotIndex].occupy(executionId);
    
    const assignment = ExecutionAssignment.create(executionId, this.props.slots[freeSlotIndex].slotId);
    this.props.assignments.push(assignment);

    this.props.status = WorkerStatus.Busy;
    this.addDomainEvent(new ExecutionAssignedToWorker(this.id, executionId, assignment.slotId));
  }

  public completeExecution(executionId: string, durationMs: number): void {
    const assignment = this.props.assignments.find(a => a.executionId === executionId);
    if (!assignment) return;

    assignment.markCompleted();
    
    const slotIndex = this.props.slots.findIndex(s => s.executionId === executionId);
    if (slotIndex !== -1) {
      this.props.slots[slotIndex] = this.props.slots[slotIndex].free();
    }

    if (this.props.slots.every(s => !s.isOccupied) && this.props.status === WorkerStatus.Busy) {
      this.props.status = WorkerStatus.Idle;
    }

    this.addDomainEvent(new ExecutionCompletedByWorker(this.id, executionId, durationMs));
  }

  public pause(reason: string): void {
    if (this.props.status === WorkerStatus.Terminated) return;
    this.props.status = WorkerStatus.Paused;
    this.addDomainEvent(new WorkerPaused(this.id, reason));
  }

  public resume(): void {
    if (this.props.status !== WorkerStatus.Paused) return;
    this.props.status = this.props.slots.some(s => s.isOccupied) ? WorkerStatus.Busy : WorkerStatus.Idle;
    this.addDomainEvent(new WorkerResumed(this.id));
  }

  public shutdown(reason: string): void {
    if (this.props.status === WorkerStatus.Terminated) return;
    this.props.status = WorkerStatus.Terminated;
    if (this.props.currentSession?.isActive) {
      this.props.currentSession.terminate(reason);
    }
    this.addDomainEvent(new WorkerStopped(this.id, reason));
  }
}
