import { WorkspaceException } from './WorkspaceException';

export class InvalidWorkspaceIdException extends WorkspaceException {
  constructor(message: string) {
    super(message, 'INVALID_WORKSPACE_ID');
  }
}
