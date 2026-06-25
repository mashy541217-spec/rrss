import { ICommand } from '@rrss-auto/application';

export class RemoveConditionCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly conditionId: string
  ) {}
}
