import { ICommand } from '@rrss-auto/application';

export class DuplicateAutomationCommand implements ICommand {
  constructor(
    public readonly sourceId: string,
    public readonly newName: string
  ) {}
}
