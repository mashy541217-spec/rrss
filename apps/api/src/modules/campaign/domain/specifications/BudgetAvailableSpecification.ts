import { Specification } from '@rrss-auto/domain';
import { Campaign } from '../aggregate/Campaign';
import { CampaignBudgetPolicy } from '../policies/CampaignBudgetPolicy';

export class BudgetAvailableSpecification extends Specification<Campaign> {
  public isSatisfiedBy(campaign: Campaign): boolean {
    return CampaignBudgetPolicy.isBudgetAvailable(campaign.budget);
  }
}