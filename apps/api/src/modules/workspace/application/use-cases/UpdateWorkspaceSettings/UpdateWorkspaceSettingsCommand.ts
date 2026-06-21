import { ICommand } from '@rrss-auto/application';

export class UpdateWorkspaceSettingsCommand implements ICommand {
  constructor(
    public readonly workspaceId: string,
    public readonly timezone: string,
    public readonly locale: string
  ) {}
}
