import { SchedulerException } from './SchedulerException';

export class InvalidSchedulerTransitionException extends SchedulerException {
  constructor(message: string) {
    super(message, 'INVALID_SCHEDULER_TRANSITION');
  }
}
