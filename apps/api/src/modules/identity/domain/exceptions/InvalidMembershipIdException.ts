import { IdentityException } from './IdentityException';
export class InvalidMembershipIdException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_MEMBERSHIP_ID'); }
}
