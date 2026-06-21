import { DomainException } from '@rrss-auto/domain';

/**
 * Base exception for all Identity bounded context errors.
 * All identity-specific exceptions must extend this class.
 */
export abstract class IdentityException extends DomainException {
  protected constructor(message: string, code: string) {
    super(message, code);
  }
}
