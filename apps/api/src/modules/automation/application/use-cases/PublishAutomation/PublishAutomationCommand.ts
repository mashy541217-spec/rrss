import { ICommand } from '@rrss-auto/application';

export class PublishAutomationCommand implements ICommand {
  constructor(public readonly id: string) {}
}
