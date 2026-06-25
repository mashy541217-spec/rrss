import { ICommand } from '@rrss-auto/application';

export class UpdateCredentialMetadataCommand implements ICommand {
  constructor(
    public readonly credentialId: string,
    public readonly metadata: Record<string, any>
  ) {}
}
