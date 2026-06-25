import { Specification } from '@rrss-auto/domain';
import { Automation } from '../aggregate/Automation';

export class ExecutionPlanValidSpecification extends Specification<Automation> {
  public isSatisfiedBy(automation: Automation): boolean {
    if (!automation.executionPlan) return false;
    return Array.isArray(automation.executionPlan.steps) && automation.executionPlan.steps.length > 0;
  }
}
