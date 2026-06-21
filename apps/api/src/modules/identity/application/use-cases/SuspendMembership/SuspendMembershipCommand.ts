import { ICommand } from '@rrss-auto/application';

export class SuspendMembershipCommand implements ICommand {
  constructor(
    public readonly membershipId: string,
    public readonly reason: string,
  ) {}
}
