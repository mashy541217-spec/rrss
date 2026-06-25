import { AdReport } from '../entities/AdReport';

export interface IReportingModule {
  /**
   * Abstracted async reporting. Returns a standard AdReport.
   */
  getCampaignReport(campaignId: string, startDate: Date, endDate: Date): Promise<AdReport>;
  getAdGroupReport(adGroupId: string, startDate: Date, endDate: Date): Promise<AdReport>;
  getAccountReport(startDate: Date, endDate: Date): Promise<AdReport>;
}
