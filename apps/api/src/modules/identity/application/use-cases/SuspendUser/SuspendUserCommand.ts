import { ICommand } from '@rrss-auto/application';

export class SuspendUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly reason: string,
  ) {}
}
