import { IdentityException } from './IdentityException';
export class InvalidPermissionIdentifierException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_PERMISSION_IDENTIFIER'); }
}
