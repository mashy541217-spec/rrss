import { DomainException } from '@rrss-auto/domain';

export abstract class WorkerException extends DomainException {
  protected constructor(message: string, code: string) {
    super(message, code);
  }
}
