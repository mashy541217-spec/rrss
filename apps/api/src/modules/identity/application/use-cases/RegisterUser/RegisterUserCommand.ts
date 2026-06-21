import { ICommand } from '@rrss-auto/application';

export class RegisterUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly displayName: string,
    public readonly passwordHash: string,
  ) {}
}
