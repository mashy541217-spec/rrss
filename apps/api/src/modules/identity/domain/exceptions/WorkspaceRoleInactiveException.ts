import { IdentityException } from './IdentityException';
export class WorkspaceRoleInactiveException extends IdentityException {
  constructor(message: string) { super(message, 'WORKSPACE_ROLE_INACTIVE'); }
}
