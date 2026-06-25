import { CampaignChannel } from '../entities/CampaignChannel';

export class CampaignChannelPolicy {
  public static isChannelConfigValid(channel: CampaignChannel): boolean {
    if (!channel.platform.value || !channel.type) {
      return false;
    }
    return true;
  }
}