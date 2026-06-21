import { ExecutionException } from './ExecutionException';
export class ExecutionStepNotFoundException extends ExecutionException {
  constructor(message: string) { super(message, 'EXECUTION_STEP_NOT_FOUND'); this.name = 'ExecutionStepNotFoundException'; }
}
