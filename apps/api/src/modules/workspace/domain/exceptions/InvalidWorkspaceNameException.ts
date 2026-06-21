import { WorkspaceException } from './WorkspaceException';

export class InvalidWorkspaceNameException extends WorkspaceException {
  constructor(message: string) {
    super(message, 'INVALID_WORKSPACE_NAME');
  }
}
