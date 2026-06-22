import { WorkerException } from './WorkerException';

export class WorkerNotFoundException extends WorkerException {
  constructor(message: string) {
    super(message, 'WORKER_NOT_FOUND');
  }
}
