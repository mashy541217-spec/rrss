import { IdentityException } from './IdentityException';
export class MembershipAlreadyRevokedException extends IdentityException {
  constructor(message: string) { super(message, 'MEMBERSHIP_ALREADY_REVOKED'); }
}
