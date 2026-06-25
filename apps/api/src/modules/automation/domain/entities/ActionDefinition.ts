import { ActionType } from '../enums/ActionType';

export class ActionDefinition {
  constructor(
    public readonly type: ActionType,
    public readonly name: string,
    public readonly configuration: any
  ) {}

  public static create(type: ActionType, name: string, configuration: any): ActionDefinition {
    return new ActionDefinition(type, name, configuration);
  }
}
