import { ICampaignModule } from '../modules/ICampaignModule';
import { IReportingModule } from '../modules/IReportingModule';

export interface IAdvertisingSession {
  sessionId: string;
  ping(): Promise<boolean>;
  close(): Promise<void>;

  campaigns: ICampaignModule;
  reports: IReportingModule;
}

export interface IAdvertisingProvider {
  authenticate(credentials: Record<string, string>): Promise<IAdvertisingSession>;
}
