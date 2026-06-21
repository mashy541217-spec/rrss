import { IdentityException } from './IdentityException';
export class InvalidUserIdException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_USER_ID'); }
}
