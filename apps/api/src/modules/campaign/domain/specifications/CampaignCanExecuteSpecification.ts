import { Specification } from '@rrss-auto/domain';
import { Campaign } from '../aggregate/Campaign';
import { CampaignState } from '../enums/CampaignState';
import { CampaignBudgetPolicy } from '../policies/CampaignBudgetPolicy';

export class CampaignCanExecuteSpecification extends Specification<Campaign> {
  public isSatisfiedBy(campaign: Campaign): boolean {
    return (
      !campaign.isDeleted &&
      (campaign.status.value === CampaignState.Ready ||
        campaign.status.value === CampaignState.Scheduled ||
        campaign.status.value === CampaignState.Running) &&
      CampaignBudgetPolicy.isBudgetAvailable(campaign.budget)
    );
  }
}