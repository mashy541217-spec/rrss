import { IAdvertisingProvider, IAdvertisingSession } from '../core/IAdvertisingProvider';
import { ICampaignModule } from '../modules/ICampaignModule';
import { IReportingModule } from '../modules/IReportingModule';
import { AdCampaign } from '../entities/AdCampaign';
import { AdGroup } from '../entities/AdGroup';
import { AdCreative } from '../entities/AdCreative';
import { AdReport } from '../entities/AdReport';

class GoogleAdsSession implements IAdvertisingSession {
  sessionId = `gads-session-${Date.now()}`;
  async ping(): Promise<boolean> { return true; }
  async close(): Promise<void> {}

  campaigns: ICampaignModule = {
    getCampaign: async (id) => null,
    createCampaign: async (data) => new AdCampaign(),
    updateCampaignStatus: async (id, status) => true,
    createAdGroup: async (cId, data) => new AdGroup(),
    createCreative: async (agId, data) => new AdCreative()
  };

  reports: IReportingModule = {
    getCampaignReport: async (id, start, end) => new AdReport(),
    getAdGroupReport: async (id, start, end) => new AdReport(),
    getAccountReport: async (start, end) => new AdReport()
  };
}

export class GoogleAdsProvider implements IAdvertisingProvider {
  async authenticate(credentials: Record<string, string>): Promise<IAdvertisingSession> {
    console.log(`[GoogleAdsProvider] Authenticating via Google OAuth 2.0...`);
    return new GoogleAdsSession();
  }
}
