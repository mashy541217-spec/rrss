import { WorkspaceException } from './WorkspaceException';

export class InvalidWorkspaceTransitionException extends WorkspaceException {
  constructor(message: string) {
    super(message, 'INVALID_WORKSPACE_TRANSITION');
  }
}
