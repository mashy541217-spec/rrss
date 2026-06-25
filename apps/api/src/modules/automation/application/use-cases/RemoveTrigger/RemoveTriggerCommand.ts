import { ICommand } from '@rrss-auto/application';

export class RemoveTriggerCommand implements ICommand {
  constructor(public readonly id: string) {}
}
