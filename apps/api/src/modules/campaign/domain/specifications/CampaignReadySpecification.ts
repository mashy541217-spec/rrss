import { Specification } from '@rrss-auto/domain';
import { Campaign } from '../aggregate/Campaign';

export class CampaignReadySpecification extends Specification<Campaign> {
  public isSatisfiedBy(campaign: Campaign): boolean {
    return (
      !campaign.isDeleted &&
      campaign.contents.length > 0 &&
      campaign.channels.length > 0
    );
  }
}