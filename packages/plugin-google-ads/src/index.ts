import { Plugin, PluginContext } from '@rrss-auto/plugin-sdk';
import { GoogleAdsApiRouter } from './execution/GoogleAdsApiRouter';
import { GoogleAdsDiscoveryService } from './discovery/GoogleAdsDiscoveryService';
import { MetadataCacheManager } from './discovery/MetadataCacheManager';
import { GoogleAdsWebhookIngester } from './streaming/GoogleAdsWebhookIngester';
import { GaqlTranspiler } from './execution/GaqlTranspiler';

export class GoogleAdsPlugin implements Plugin {
  id = 'plugin-google-ads-enterprise';
  name = 'Google Ads Enterprise Provider';
  version = '1.0.0';

  private cacheManager = new MetadataCacheManager();
  private discovery = new GoogleAdsDiscoveryService(this.cacheManager);
  private router = new GoogleAdsApiRouter();
  private webhookIngester = new GoogleAdsWebhookIngester();
  private transpiler = new GaqlTranspiler();

  async initialize(context: PluginContext): Promise<void> {
    console.log(`[GoogleAdsPlugin] Initialized.`);
  }

  async executeIntent(workspaceId: string, managerId: string, customerId: string, intent: string, payload: any): Promise<any> {
    // Ensure we have basic system metadata cached for this specific MCC hierarchy
    await this.discovery.discoverAccountHierarchy(workspaceId, managerId, customerId);

    // Route intelligently (Search vs PMax vs Batch)
    return await this.router.executeSmartStrategy(intent, payload);
  }

  processWebhook(topic: string, payload: any) {
    return this.webhookIngester.ingestWebhook(topic, payload);
  }
  
  transpileReport(entity: string, metrics: string[], startDate: Date, endDate: Date): string {
    return this.transpiler.transpileReportQuery(entity, metrics, startDate, endDate);
  }
}
