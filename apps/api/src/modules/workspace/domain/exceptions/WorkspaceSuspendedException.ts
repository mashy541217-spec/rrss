import { WorkspaceException } from './WorkspaceException';

export class WorkspaceSuspendedException extends WorkspaceException {
  constructor(message: string) {
    super(message, 'WORKSPACE_SUSPENDED');
  }
}
