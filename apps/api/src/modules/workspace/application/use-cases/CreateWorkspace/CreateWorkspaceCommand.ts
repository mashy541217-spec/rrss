import { ICommand } from '@rrss-auto/application';

export class CreateWorkspaceCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly timezone: string,
    public readonly locale: string,
    public readonly ownerId: string,
    public readonly limits: {
      maxBusinesses: number;
      maxConcurrentExecutions: number;
      maxProxies: number;
      maxVms: number;
    }
  ) {}
}
