import { IdentityException } from './IdentityException';
export class InvalidPasswordHashException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_PASSWORD_HASH'); }
}
