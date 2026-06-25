import { ICommand } from '@rrss-auto/application';

export class GeneratePublicationProfileCommand implements ICommand {
  constructor(
    public readonly workspaceRef: string,
    public readonly name: string,
    public readonly createdBy: string,
    public readonly platforms: string[], // Platform adapter keys
    public readonly defaultFormat?: string,
  ) {}
}
