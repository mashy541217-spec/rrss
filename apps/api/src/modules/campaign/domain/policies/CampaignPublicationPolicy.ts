import { CampaignState } from '../enums/CampaignState';

export class CampaignPublicationPolicy {
  public static canGeneratePublication(state: CampaignState): boolean {
    return state === CampaignState.Ready || state === CampaignState.Scheduled || state === CampaignState.Running;
  }
}