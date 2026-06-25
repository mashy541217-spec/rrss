export enum AdStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum AdBidStrategy {
  MANUAL_CPC = 'MANUAL_CPC',
  TARGET_CPA = 'TARGET_CPA',
  TARGET_ROAS = 'TARGET_ROAS',
  MAXIMIZE_CLICKS = 'MAXIMIZE_CLICKS',
  MAXIMIZE_CONVERSIONS = 'MAXIMIZE_CONVERSIONS'
}

export class AdCampaign {
  id?: string;
  name?: string;
  status: AdStatus = AdStatus.DRAFT;
  dailyBudget?: number;
  lifetimeBudget?: number;
  currency: string = 'USD';
  bidStrategy: AdBidStrategy = AdBidStrategy.MAXIMIZE_CONVERSIONS;
  targetCpa?: number;
  targetRoas?: number;
  startDate?: Date;
  endDate?: Date;
  attributes: Record<string, any> = {};
}
