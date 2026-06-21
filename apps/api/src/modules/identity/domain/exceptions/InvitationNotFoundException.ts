import { IdentityException } from './IdentityException';
export class InvitationNotFoundException extends IdentityException {
  constructor(message: string) { super(message, 'INVITATION_NOT_FOUND'); }
}
