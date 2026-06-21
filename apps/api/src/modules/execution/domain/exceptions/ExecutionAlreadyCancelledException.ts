import { ExecutionException } from './ExecutionException';
export class ExecutionAlreadyCancelledException extends ExecutionException {
  constructor(message: string) { super(message, 'EXECUTION_ALREADY_CANCELLED'); this.name = 'ExecutionAlreadyCancelledException'; }
}
