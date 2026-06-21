import { IdentityException } from './IdentityException';
export class InvitationExpiredException extends IdentityException {
  constructor(message: string) { super(message, 'INVITATION_EXPIRED'); }
}
