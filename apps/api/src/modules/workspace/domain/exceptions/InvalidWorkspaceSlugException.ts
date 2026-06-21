import { WorkspaceException } from './WorkspaceException';

export class InvalidWorkspaceSlugException extends WorkspaceException {
  constructor(message: string) {
    super(message, 'INVALID_WORKSPACE_SLUG');
  }
}
