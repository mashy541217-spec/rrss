import { ConditionType } from '../enums/ConditionType';

export class ConditionDefinition {
  constructor(
    public readonly type: ConditionType,
    public readonly expression: string,
    public readonly configuration: any
  ) {}

  public static create(type: ConditionType, expression: string, configuration: any): ConditionDefinition {
    return new ConditionDefinition(type, expression, configuration);
  }
}
