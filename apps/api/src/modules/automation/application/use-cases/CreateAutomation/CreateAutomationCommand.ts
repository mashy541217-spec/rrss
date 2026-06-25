import { ICommand } from '@rrss-auto/application';

export class CreateAutomationCommand implements ICommand {
  constructor(
    public readonly workspaceRef: string,
    public readonly name: string,
    public readonly description?: string
  ) {}
}
