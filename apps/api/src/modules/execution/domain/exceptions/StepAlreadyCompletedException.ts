import { ExecutionException } from './ExecutionException';
export class StepAlreadyCompletedException extends ExecutionException {
  constructor(message: string) { super(message, 'STEP_ALREADY_COMPLETED'); this.name = 'StepAlreadyCompletedException'; }
}
