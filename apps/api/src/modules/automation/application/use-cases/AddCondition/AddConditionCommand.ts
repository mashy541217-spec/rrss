import { ICommand } from '@rrss-auto/application';

export class AddConditionCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly expression: string,
    public readonly configuration: any
  ) {}
}
