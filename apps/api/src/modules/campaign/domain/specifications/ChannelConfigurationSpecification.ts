import { Specification } from '@rrss-auto/domain';
import { CampaignChannel } from '../entities/CampaignChannel';
import { CampaignChannelPolicy } from '../policies/CampaignChannelPolicy';

export class ChannelConfigurationSpecification extends Specification<CampaignChannel> {
  public isSatisfiedBy(channel: CampaignChannel): boolean {
    return CampaignChannelPolicy.isChannelConfigValid(channel);
  }
}