import { AdStatus } from './AdCampaign';

export class AdGroup {
  id?: string;
  campaignId!: string;
  name?: string;
  status: AdStatus = AdStatus.DRAFT;
  targetCpa?: number; // AdGroup level override
  attributes: Record<string, any> = {};
}
