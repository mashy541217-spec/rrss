import { WorkspaceException } from './WorkspaceException';

export class WorkspaceArchivedException extends WorkspaceException {
  constructor(message: string) {
    super(message, 'WORKSPACE_ARCHIVED');
  }
}
