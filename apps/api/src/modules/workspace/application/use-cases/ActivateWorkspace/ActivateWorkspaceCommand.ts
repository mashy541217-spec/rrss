import { ICommand } from '@rrss-auto/application';

export class ActivateWorkspaceCommand implements ICommand {
  constructor(public readonly workspaceId: string) {}
}
