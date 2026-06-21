import { IdentityException } from './IdentityException';
export class InvalidWorkspaceRoleIdException extends IdentityException {
  constructor(message: string) { super(message, 'INVALID_WORKSPACE_ROLE_ID'); }
}
