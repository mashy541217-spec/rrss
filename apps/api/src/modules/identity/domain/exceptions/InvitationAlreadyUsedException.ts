import { IdentityException } from './IdentityException';
export class InvitationAlreadyUsedException extends IdentityException {
  constructor(message: string) { super(message, 'INVITATION_ALREADY_USED'); }
}
