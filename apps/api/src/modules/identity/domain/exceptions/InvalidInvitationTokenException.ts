import { IdentityException } from './IdentityException';
export class InvalidInvitationTokenException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_INVITATION_TOKEN'); }
}
