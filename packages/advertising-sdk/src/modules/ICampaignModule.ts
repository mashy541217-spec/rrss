import { AdCampaign, AdStatus } from '../entities/AdCampaign';
import { AdGroup } from '../entities/AdGroup';
import { AdCreative } from '../entities/AdCreative';

export interface ICampaignModule {
  getCampaign(id: string): Promise<AdCampaign | null>;
  createCampaign(data: Partial<AdCampaign>): Promise<AdCampaign>;
  updateCampaignStatus(id: string, status: AdStatus): Promise<boolean>;
  
  createAdGroup(campaignId: string, data: Partial<AdGroup>): Promise<AdGroup>;
  createCreative(adGroupId: string, data: Partial<AdCreative>): Promise<AdCreative>;
}
