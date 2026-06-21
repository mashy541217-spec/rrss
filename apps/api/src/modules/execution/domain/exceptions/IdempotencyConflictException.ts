import { ExecutionException } from './ExecutionException';
export class IdempotencyConflictException extends ExecutionException {
  constructor(message: string) { super(message, 'IDEMPOTENCY_CONFLICT'); this.name = 'IdempotencyConflictException'; }
}
