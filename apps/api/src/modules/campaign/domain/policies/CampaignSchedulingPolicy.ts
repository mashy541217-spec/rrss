import { CampaignPeriod } from '../value-objects/CampaignPeriod';

export class CampaignSchedulingPolicy {
  public static isValidPeriod(period: CampaignPeriod): boolean {
    if (period.endDate && period.endDate <= period.startDate) {
      return false;
    }
    return true;
  }
}