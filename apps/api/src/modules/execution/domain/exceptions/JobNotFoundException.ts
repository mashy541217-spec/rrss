import { ExecutionException } from './ExecutionException';
export class JobNotFoundException extends ExecutionException {
  constructor(message: string) { super(message, 'JOB_NOT_FOUND'); this.name = 'JobNotFoundException'; }
}
