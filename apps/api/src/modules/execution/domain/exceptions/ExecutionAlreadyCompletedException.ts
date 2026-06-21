import { ExecutionException } from './ExecutionException';
export class ExecutionAlreadyCompletedException extends ExecutionException {
  constructor(message: string) { super(message, 'EXECUTION_ALREADY_COMPLETED'); this.name = 'ExecutionAlreadyCompletedException'; }
}
