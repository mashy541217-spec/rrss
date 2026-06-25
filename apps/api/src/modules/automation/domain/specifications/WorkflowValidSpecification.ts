import { Specification } from '@rrss-auto/domain';
import { Automation } from '../aggregate/Automation';
import { WorkflowValidationPolicy } from '../policies/WorkflowValidationPolicy';

export class WorkflowValidSpecification extends Specification<Automation> {
  public isSatisfiedBy(automation: Automation): boolean {
    return WorkflowValidationPolicy.validate(automation.nodes, automation.connections);
  }
}
