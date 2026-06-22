import { Scheduler, SchedulerProps } from '../aggregates/Scheduler';
import { SchedulerId } from '../value-objects/SchedulerId';

export class SchedulerFactory {
  public static create(props: Omit<SchedulerProps, 'status'>, rawId: string): Scheduler {
    const id = SchedulerId.create(rawId);
    return Scheduler.initialize(props, id);
  }
}
