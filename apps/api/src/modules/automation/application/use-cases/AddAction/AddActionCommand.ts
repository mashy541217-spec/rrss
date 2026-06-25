import { ICommand } from '@rrss-auto/application';

export class AddActionCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly name: string,
    public readonly configuration: any
  ) {}
}
