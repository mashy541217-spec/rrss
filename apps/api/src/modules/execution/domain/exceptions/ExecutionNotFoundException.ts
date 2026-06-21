import { ExecutionException } from './ExecutionException';
export class ExecutionNotFoundException extends ExecutionException {
  constructor(message: string) { super(message, 'EXECUTION_NOT_FOUND'); this.name = 'ExecutionNotFoundException'; }
}
