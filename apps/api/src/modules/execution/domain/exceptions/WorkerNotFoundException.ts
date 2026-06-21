import { ExecutionException } from './ExecutionException';
export class WorkerNotFoundException extends ExecutionException {
  constructor(message: string) { super(message, 'WORKER_NOT_FOUND'); this.name = 'WorkerNotFoundException'; }
}
