import { IdentityException } from './IdentityException';
export class InvalidEmailException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_EMAIL'); }
}
