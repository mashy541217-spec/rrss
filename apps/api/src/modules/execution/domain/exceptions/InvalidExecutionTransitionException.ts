import { ExecutionException } from './ExecutionException';
export class InvalidExecutionTransitionException extends ExecutionException {
  constructor(message: string) { super(message, 'INVALID_EXECUTION_TRANSITION'); this.name = 'InvalidExecutionTransitionException'; }
}
