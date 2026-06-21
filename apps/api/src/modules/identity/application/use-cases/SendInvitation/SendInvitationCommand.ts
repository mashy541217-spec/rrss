import { ICommand } from '@rrss-auto/application';

export class SendInvitationCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly workspaceRef: string,
    public readonly roleId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
  ) {}
}
