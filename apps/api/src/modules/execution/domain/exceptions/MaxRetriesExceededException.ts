import { ExecutionException } from './ExecutionException';
export class MaxRetriesExceededException extends ExecutionException {
  constructor(message: string) { super(message, 'MAX_RETRIES_EXCEEDED'); this.name = 'MaxRetriesExceededException'; }
}
