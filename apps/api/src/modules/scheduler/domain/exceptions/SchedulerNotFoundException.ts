import { SchedulerException } from './SchedulerException';

export class SchedulerNotFoundException extends SchedulerException {
  constructor(message: string) {
    super(message, 'SCHEDULER_NOT_FOUND');
  }
}
