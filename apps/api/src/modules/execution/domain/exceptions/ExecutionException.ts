import { DomainException } from '@rrss-auto/domain';

/** Base exception for all Execution bounded context domain exceptions. */
export class ExecutionException extends DomainException {
  constructor(message: string, code: string = 'EXECUTION_ERROR') {
    super(message, code);
    this.name = 'ExecutionException';
  }
}
