import { IdentityException } from './IdentityException';
export class UserEmailAlreadyExistsException extends IdentityException {
  constructor(message: string) { super(message, 'USER_EMAIL_ALREADY_EXISTS'); }
}
