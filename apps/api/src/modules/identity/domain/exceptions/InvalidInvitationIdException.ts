import { IdentityException } from './IdentityException';
export class InvalidInvitationIdException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_INVITATION_ID'); }
}
