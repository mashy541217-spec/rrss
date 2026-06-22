import { SchedulerException } from './SchedulerException';

export class ScheduleNotFoundException extends SchedulerException {
  constructor(message: string) {
    super(message, 'SCHEDULE_NOT_FOUND');
  }
}
