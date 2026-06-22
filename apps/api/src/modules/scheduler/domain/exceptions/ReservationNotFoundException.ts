import { SchedulerException } from './SchedulerException';

export class ReservationNotFoundException extends SchedulerException {
  constructor(message: string) {
    super(message, 'RESERVATION_NOT_FOUND');
  }
}
