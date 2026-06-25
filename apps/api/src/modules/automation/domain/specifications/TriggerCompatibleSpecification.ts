import { Specification } from '@rrss-auto/domain';
import { Automation } from '../aggregate/Automation';
import { TriggerType } from '../enums/TriggerType';

export class TriggerCompatibleSpecification extends Specification<Automation> {
  constructor(private readonly requiredType: TriggerType) {
    super();
  }

  public isSatisfiedBy(automation: Automation): boolean {
    if (!automation.trigger) return false;
    return automation.trigger.type === this.requiredType;
  }
}
