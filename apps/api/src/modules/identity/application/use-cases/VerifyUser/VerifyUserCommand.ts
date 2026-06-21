import { ICommand } from '@rrss-auto/application';

export class VerifyUserCommand implements ICommand {
  constructor(public readonly userId: string) {}
}
