import { ICommand } from '@rrss-auto/application';

export class ArchiveAutomationCommand implements ICommand {
  constructor(public readonly id: string) {}
}
