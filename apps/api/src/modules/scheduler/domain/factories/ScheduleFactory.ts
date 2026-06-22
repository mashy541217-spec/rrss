import { Schedule, ScheduleProps } from '../aggregates/Schedule';
import { ScheduleId } from '../value-objects/ScheduleId';

export class ScheduleFactory {
  public static create(props: Omit<ScheduleProps, 'status' | 'lastRunAt' | 'nextRunAt'>, rawId: string): Schedule {
    const id = ScheduleId.create(rawId);
    return Schedule.create(props, id);
  }
}
