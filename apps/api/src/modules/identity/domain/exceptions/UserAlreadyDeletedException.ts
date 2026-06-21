import { IdentityException } from './IdentityException';
export class UserAlreadyDeletedException extends IdentityException {
  constructor(message: string) { super(message, 'USER_ALREADY_DELETED'); }
}
