import { IdentityException } from './IdentityException';
export class InvalidDisplayNameException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_DISPLAY_NAME'); }
}
