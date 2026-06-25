import { ICommand } from '@rrss-auto/application';

export class RotateCredentialCommand implements ICommand {
  constructor(
    public readonly credentialId: string,
    public readonly plainTextSecret: string
  ) {}
}
