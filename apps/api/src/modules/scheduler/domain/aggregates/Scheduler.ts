import { AggregateRoot } from '@rrss-auto/domain';
import { SchedulerId } from '../value-objects/SchedulerId';
import { SchedulerStatus } from '../enums/SchedulerStatus';
import { ConcurrencyPolicy } from '../value-objects/ConcurrencyPolicy';
import { WorkerSelectionPolicy } from '../value-objects/WorkerSelectionPolicy';
import { PriorityPolicy } from '../value-objects/PriorityPolicy';
import { RetrySchedulingPolicy } from '../value-objects/RetrySchedulingPolicy';
import { SchedulingDecision } from '../value-objects/SchedulingDecision';
import { DispatchPlan } from '../value-objects/DispatchPlan';
import { InvalidSchedulerTransitionException } from '../exceptions/InvalidSchedulerTransitionException';

export interface SchedulerProps {
  status: SchedulerStatus;
  concurrencyPolicy: ConcurrencyPolicy;
  workerSelectionPolicy: WorkerSelectionPolicy;
  priorityPolicy: PriorityPolicy;
  retryPolicy: RetrySchedulingPolicy;
}

export class Scheduler extends AggregateRoot<SchedulerProps, SchedulerId> {
  private constructor(props: SchedulerProps, id: SchedulerId) {
    super(props, id);
  }

  get status(): SchedulerStatus { return this.props.status; }
  get concurrencyPolicy(): ConcurrencyPolicy { return this.props.concurrencyPolicy; }
  get workerSelectionPolicy(): WorkerSelectionPolicy { return this.props.workerSelectionPolicy; }
  get priorityPolicy(): PriorityPolicy { return this.props.priorityPolicy; }
  get retryPolicy(): RetrySchedulingPolicy { return this.props.retryPolicy; }

  public static initialize(props: Omit<SchedulerProps, 'status'>, id: SchedulerId): Scheduler {
    return new Scheduler({
      ...props,
      status: SchedulerStatus.Active,
    }, id);
  }

  public pause(): void {
    if (this.props.status === SchedulerStatus.Draining) {
      throw new InvalidSchedulerTransitionException('Cannot pause a draining scheduler');
    }
    this.props.status = SchedulerStatus.Paused;
  }

  public resume(): void {
    if (this.props.status !== SchedulerStatus.Paused) {
      throw new InvalidSchedulerTransitionException('Can only resume a paused scheduler');
    }
    this.props.status = SchedulerStatus.Active;
  }

  public drain(): void {
    this.props.status = SchedulerStatus.Draining;
  }

  public evaluateExecution(executionId: string, currentActiveCount: number): SchedulingDecision {
    if (this.props.status === SchedulerStatus.Paused || this.props.status === SchedulerStatus.Draining) {
      return SchedulingDecision.defer('Scheduler is not active');
    }

    if (currentActiveCount >= this.concurrencyPolicy.limit.maxConcurrent) {
      if (this.concurrencyPolicy.queueIfFull) {
        return SchedulingDecision.defer('Concurrency limit reached, queuing');
      } else {
        return SchedulingDecision.cancel('Concurrency limit reached, drop requested');
      }
    }

    const plan = DispatchPlan.create({
      executionId,
      priority: this.priorityPolicy.basePriority,
      scheduledAt: new Date(),
    });

    return SchedulingDecision.dispatch(plan);
  }
}
