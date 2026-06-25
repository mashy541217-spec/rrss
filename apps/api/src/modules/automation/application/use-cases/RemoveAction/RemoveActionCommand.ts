import { ICommand } from '@rrss-auto/application';

export class RemoveActionCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly actionId: string
  ) {}
}
