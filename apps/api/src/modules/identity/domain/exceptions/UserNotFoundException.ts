import { IdentityException } from './IdentityException';
export class UserNotFoundException extends IdentityException {
  constructor(message: string) { super(message, 'USER_NOT_FOUND'); }
}
