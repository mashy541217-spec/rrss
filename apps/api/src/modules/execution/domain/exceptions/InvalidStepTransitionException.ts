import { ExecutionException } from './ExecutionException';
export class InvalidStepTransitionException extends ExecutionException {
  constructor(message: string) { super(message, 'INVALID_STEP_TRANSITION'); this.name = 'InvalidStepTransitionException'; }
}
