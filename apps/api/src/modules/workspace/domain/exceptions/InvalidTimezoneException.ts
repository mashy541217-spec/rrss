import { WorkspaceException } from './WorkspaceException';

export class InvalidTimezoneException extends WorkspaceException {
  constructor(message: string) {
    super(message, 'INVALID_TIMEZONE');
  }
}
