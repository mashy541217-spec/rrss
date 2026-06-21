import { ICommand } from '@rrss-auto/application';

export class CreateWorkspaceRoleCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly workspaceRef: string,
    public readonly initialPermissions: string[] = [],
  ) {}
}
