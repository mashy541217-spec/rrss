import { SchedulerException } from './SchedulerException';

export class InvalidScheduleTransitionException extends SchedulerException {
  constructor(message: string) {
    super(message, 'INVALID_SCHEDULE_TRANSITION');
  }
}
