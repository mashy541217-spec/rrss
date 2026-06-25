import { Plugin, PluginContext } from '@rrss-auto/plugin-sdk';
import { WooCommerceApiRouter } from './execution/WooCommerceApiRouter';
import { WooCommerceDiscoveryService } from './discovery/WooCommerceDiscoveryService';
import { WooCommerceMetadataCache } from './discovery/WooCommerceMetadataCache';
import { WooCommerceWebhookIngester } from './streaming/WooCommerceWebhookIngester';

export class WooCommercePlugin implements Plugin {
  id = 'plugin-woocommerce-enterprise';
  name = 'WooCommerce Enterprise Provider';
  version = '1.0.0';

  private cacheManager = new WooCommerceMetadataCache();
  private discovery = new WooCommerceDiscoveryService(this.cacheManager);
  private router = new WooCommerceApiRouter();
  private webhookIngester = new WooCommerceWebhookIngester();

  async initialize(context: PluginContext): Promise<void> {
    console.log(`[WooCommercePlugin] Initialized.`);
  }

  async executeIntent(workspaceId: string, storeUrl: string, endpoint: string, method: string, payload: any): Promise<any> {
    // 1. Ensure we have basic system metadata cached for this specific store
    await this.discovery.discoverSystemStatus(workspaceId, storeUrl);

    // 2. Route intelligently (REST vs Batch)
    return await this.router.executeSmartStrategy(endpoint, method, payload);
  }

  processWebhook(topic: string, payload: any) {
    return this.webhookIngester.ingestWebhook(topic, payload);
  }
}
