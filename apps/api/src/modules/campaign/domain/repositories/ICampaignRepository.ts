import { Campaign } from '../aggregate/Campaign';
import { CampaignId } from '../value-objects/CampaignId';

export interface ICampaignRepository {
  save(campaign: Campaign): Promise<void>;
  findById(id: CampaignId): Promise<Campaign | null>;
  findByWorkspace(workspaceRef: string): Promise<Campaign[]>;
  delete(id: CampaignId): Promise<void>;
}
