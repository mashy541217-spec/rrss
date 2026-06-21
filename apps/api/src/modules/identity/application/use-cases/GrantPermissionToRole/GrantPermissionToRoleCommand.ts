import { ICommand } from '@rrss-auto/application';

export class GrantPermissionToRoleCommand implements ICommand {
  constructor(
    public readonly roleId: string,
    public readonly permission: string,
  ) {}
}
