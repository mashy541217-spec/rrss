import { IPlugin, PluginContext } from '@rrss-auto/plugin-sdk';
import { SalesforceApiRouter } from './execution/SalesforceApiRouter';
import { SalesforceDiscoveryService, MetadataCacheManager } from './discovery/SalesforceDiscoveryService';
import { PlatformEventSubscriber } from './streaming/PlatformEventSubscriber';

export class SalesforcePlugin implements IPlugin {
  id = 'plugin-salesforce-enterprise';
  name = 'Salesforce Enterprise Provider';
  version = '1.0.0';

  private cacheManager = new MetadataCacheManager();
  private discovery = new SalesforceDiscoveryService(this.cacheManager);
  private router = new SalesforceApiRouter();
  private eventSubscriber = new PlatformEventSubscriber();

  async initialize(context: PluginContext): Promise<void> {
    console.log(`[SalesforcePlugin] Initializing...`);
    // Pre-warm the cache for standard objects
    await this.discovery.discoverObjectSchema('Lead');
    await this.discovery.discoverObjectSchema('Opportunity');
  }

  async executeIntent(intentName: string, payload: any): Promise<any> {
    // 1. Validate payload against cached schema if needed
    // 2. Route intelligently
    return await this.router.executeSmartStrategy(intentName, payload);
  }
  
  listenForEvents(topics: string[], callback: (event: any) => void) {
    this.eventSubscriber.startListening(topics, callback);
  }
}
