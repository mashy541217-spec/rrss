import { ExecutionException } from './ExecutionException';
export class InvalidWorkerTransitionException extends ExecutionException {
  constructor(message: string) { super(message, 'INVALID_WORKER_TRANSITION'); this.name = 'InvalidWorkerTransitionException'; }
}
