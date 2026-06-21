import { IdentityException } from './IdentityException';
export class MembershipNotFoundException extends IdentityException {
  constructor(message: string) { super(message, 'MEMBERSHIP_NOT_FOUND'); }
}
