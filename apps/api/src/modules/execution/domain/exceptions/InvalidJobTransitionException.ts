import { ExecutionException } from './ExecutionException';
export class InvalidJobTransitionException extends ExecutionException {
  constructor(message: string) { super(message, 'INVALID_JOB_TRANSITION'); this.name = 'InvalidJobTransitionException'; }
}
