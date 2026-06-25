import { ConditionDefinition } from '../entities/ConditionDefinition';

export class ConditionPolicy {
  public static validateCondition(condition: ConditionDefinition): boolean {
    return condition.expression.length > 0;
  }
}
