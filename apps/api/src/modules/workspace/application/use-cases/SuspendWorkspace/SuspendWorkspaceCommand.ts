import { ICommand } from '@rrss-auto/application';

export class SuspendWorkspaceCommand implements ICommand {
  constructor(public readonly workspaceId: string) {}
}
