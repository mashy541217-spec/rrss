import { AggregateRoot } from '@rrss-auto/domain';
import { ScheduleId } from '../value-objects/ScheduleId';
import { ScheduleStatus } from '../enums/ScheduleStatus';
import { SchedulingPolicy } from '../value-objects/SchedulingPolicy';
import { PriorityPolicy } from '../value-objects/PriorityPolicy';
import { ConcurrencyPolicy } from '../value-objects/ConcurrencyPolicy';
import { InvalidScheduleTransitionException } from '../exceptions/InvalidScheduleTransitionException';

export interface ScheduleProps {
  workspaceRef: string;
  status: ScheduleStatus;
  schedulingPolicy: SchedulingPolicy;
  priorityPolicy: PriorityPolicy;
  concurrencyPolicy?: ConcurrencyPolicy;
  lastRunAt?: Date;
  nextRunAt?: Date;
}

export class Schedule extends AggregateRoot<ScheduleProps, ScheduleId> {
  private constructor(props: ScheduleProps, id: ScheduleId) {
    super(props, id);
  }

  get workspaceRef(): string { return this.props.workspaceRef; }
  get status(): ScheduleStatus { return this.props.status; }
  get schedulingPolicy(): SchedulingPolicy { return this.props.schedulingPolicy; }
  get priorityPolicy(): PriorityPolicy { return this.props.priorityPolicy; }
  get concurrencyPolicy(): ConcurrencyPolicy | undefined { return this.props.concurrencyPolicy; }
  get lastRunAt(): Date | undefined { return this.props.lastRunAt; }
  get nextRunAt(): Date | undefined { return this.props.nextRunAt; }

  public static create(props: Omit<ScheduleProps, 'status' | 'lastRunAt' | 'nextRunAt'>, id: ScheduleId): Schedule {
    return new Schedule({
      ...props,
      status: ScheduleStatus.Active,
    }, id);
  }

  public pause(): void {
    if (this.props.status === ScheduleStatus.Cancelled || this.props.status === ScheduleStatus.Completed) {
      throw new InvalidScheduleTransitionException('Cannot pause a terminal schedule');
    }
    this.props.status = ScheduleStatus.Paused;
  }

  public resume(): void {
    if (this.props.status !== ScheduleStatus.Paused) {
      throw new InvalidScheduleTransitionException('Can only resume a paused schedule');
    }
    this.props.status = ScheduleStatus.Active;
  }

  public cancel(): void {
    if (this.props.status === ScheduleStatus.Completed) {
      throw new InvalidScheduleTransitionException('Cannot cancel a completed schedule');
    }
    this.props.status = ScheduleStatus.Cancelled;
  }

  public complete(): void {
    if (this.props.status === ScheduleStatus.Cancelled) {
      throw new InvalidScheduleTransitionException('Cannot complete a cancelled schedule');
    }
    this.props.status = ScheduleStatus.Completed;
  }

  public recordRun(date: Date): void {
    if (this.props.status !== ScheduleStatus.Active) {
      throw new InvalidScheduleTransitionException('Cannot record run on non-active schedule');
    }
    this.props.lastRunAt = date;
    // Calculation of nextRunAt depends on cron, simplified for domain model
  }
}
