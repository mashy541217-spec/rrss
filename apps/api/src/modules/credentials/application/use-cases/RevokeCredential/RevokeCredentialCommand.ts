import { ICommand } from '@rrss-auto/application';

export class RevokeCredentialCommand implements ICommand {
  constructor(
    public readonly credentialId: string,
    public readonly reason?: string
  ) {}
}
