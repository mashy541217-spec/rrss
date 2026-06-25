import { ICommand } from '@rrss-auto/application';

export class PauseAutomationCommand implements ICommand {
  constructor(public readonly id: string) {}
}
