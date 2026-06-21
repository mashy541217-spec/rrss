import { IdentityException } from './IdentityException';
export class DuplicatePermissionException extends IdentityException {
  constructor(message: string) { super(message, 'DUPLICATE_PERMISSION'); }
}
