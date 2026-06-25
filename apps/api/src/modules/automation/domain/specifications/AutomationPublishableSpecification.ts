import { Specification } from '@rrss-auto/domain';
import { Automation } from '../aggregate/Automation';
import { AutomationStatus } from '../enums/AutomationStatus';
import { WorkflowValidSpecification } from './WorkflowValidSpecification';

export class AutomationPublishableSpecification extends Specification<Automation> {
  public isSatisfiedBy(automation: Automation): boolean {
    if (automation.isDeleted) return false;
    if (automation.status !== AutomationStatus.Draft && automation.status !== AutomationStatus.Paused) {
      return false;
    }
    const workflowSpec = new WorkflowValidSpecification();
    return workflowSpec.isSatisfiedBy(automation);
  }
}
