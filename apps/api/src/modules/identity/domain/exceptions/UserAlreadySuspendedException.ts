import { IdentityException } from './IdentityException';
export class UserAlreadySuspendedException extends IdentityException {
  constructor(message: string) { super(message, 'USER_ALREADY_SUSPENDED'); }
}
