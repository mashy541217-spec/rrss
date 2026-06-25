import { Automation } from '../aggregate/Automation';
import { AutomationId } from '../value-objects/AutomationId';

export interface IAutomationRepository {
  findById(id: AutomationId): Promise<Automation | null>;
  save(automation: Automation): Promise<void>;
}
