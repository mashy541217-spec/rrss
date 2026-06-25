import { TriggerType } from '../enums/TriggerType';

export class TriggerDefinition {
  constructor(
    public readonly type: TriggerType,
    public readonly configuration: any
  ) {}

  public static create(type: TriggerType, configuration: any): TriggerDefinition {
    return new TriggerDefinition(type, configuration);
  }
}
