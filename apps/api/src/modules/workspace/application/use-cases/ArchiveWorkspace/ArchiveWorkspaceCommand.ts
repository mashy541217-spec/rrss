import { ICommand } from '@rrss-auto/application';

export class ArchiveWorkspaceCommand implements ICommand {
  constructor(public readonly workspaceId: string) {}
}
