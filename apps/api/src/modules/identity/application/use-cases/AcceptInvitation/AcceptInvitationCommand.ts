import { ICommand } from '@rrss-auto/application';

export class AcceptInvitationCommand implements ICommand {
  constructor(
    public readonly invitationId: string,
    public readonly token: string,
    public readonly userId: string,
  ) {}
}
