import { IdentityException } from './IdentityException';
export class InvalidMembershipTransitionException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_MEMBERSHIP_TRANSITION'); }
}
