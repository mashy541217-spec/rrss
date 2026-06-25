import { CampaignState } from '../enums/CampaignState';

export class RetentionPolicy {
  public static isEligibleForArchiving(state: CampaignState, completedAt?: Date): boolean {
    if (state !== CampaignState.Completed) {
      return false;
    }
    if (!completedAt) return false;
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    return (Date.now() - completedAt.getTime()) > ninetyDays;
  }
}