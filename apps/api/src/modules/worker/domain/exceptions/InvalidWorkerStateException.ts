import { WorkerException } from './WorkerException';

export class InvalidWorkerStateException extends WorkerException {
  constructor(message: string) {
    super(message, 'INVALID_WORKER_STATE');
  }
}
