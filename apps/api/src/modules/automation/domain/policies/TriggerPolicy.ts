import { TriggerType } from '../enums/TriggerType';
import { TriggerDefinition } from '../entities/TriggerDefinition';

export class TriggerPolicy {
  public static isCompatible(trigger: TriggerDefinition, targetType: TriggerType): boolean {
    return trigger.type === targetType;
  }
}
