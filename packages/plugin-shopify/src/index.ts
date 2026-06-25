import { Plugin, PluginContext } from '@rrss-auto/plugin-sdk';
import { ShopifyApiRouter } from './execution/ShopifyApiRouter';
import { ShopifyDiscoveryService } from './discovery/ShopifyDiscoveryService';
import { ShopifyMetadataCache } from './discovery/ShopifyMetadataCache';
import { ShopifyWebhookIngester } from './streaming/ShopifyWebhookIngester';

export class ShopifyPlugin implements Plugin {
  id = 'plugin-shopify-enterprise';
  name = 'Shopify Enterprise Provider';
  version = '1.0.0';

  private cacheManager = new ShopifyMetadataCache();
  private discovery = new ShopifyDiscoveryService(this.cacheManager);
  private router = new ShopifyApiRouter();
  private webhookIngester = new ShopifyWebhookIngester();

  async initialize(context: PluginContext): Promise<void> {
    console.log(`[ShopifyPlugin] Initialized.`);
  }

  async executeIntent(workspaceId: string, shopifyDomain: string, intent: string, payload: any): Promise<any> {
    // 1. Ensure we have basic system metadata cached for this specific store (e.g. inventory locations)
    await this.discovery.discoverShopConfig(workspaceId, shopifyDomain);

    // 2. Route intelligently (REST vs GraphQL vs Bulk)
    return await this.router.executeSmartStrategy(intent, payload);
  }

  processWebhook(topic: string, hmac: string, rawBody: string, payload: any) {
    if (!this.webhookIngester.verifyHmac(rawBody, hmac, 'secret')) {
      throw new Error('Invalid HMAC Signature from Shopify.');
    }
    return this.webhookIngester.ingestWebhook(topic, payload);
  }
}
