import { IdentityException } from './IdentityException';
export class WorkspaceRoleNotFoundException extends IdentityException {
  constructor(message: string) { super(message, 'WORKSPACE_ROLE_NOT_FOUND'); }
}
