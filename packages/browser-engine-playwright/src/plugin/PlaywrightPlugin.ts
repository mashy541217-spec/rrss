import { Plugin, PluginContext, PluginConfiguration, PluginHealth } from '@rrss-auto/plugin-sdk';
import { PlaywrightManifest } from './PlaywrightManifest';
import { PlaywrightBrowserProvider } from '../client/PlaywrightBrowserProvider';

export class PlaywrightPlugin implements Plugin {
  readonly manifest = PlaywrightManifest;
  private readonly provider = new PlaywrightBrowserProvider();

  public async executeAction(actionName: string, context: PluginContext, config: PluginConfiguration, params: Record<string, any>): Promise<any> {
    const isMock = config.settings?.mock === true;
    
    switch (actionName) {
      case 'LaunchBrowser': {
        const instance = await this.provider.launch({
          headless: config.settings?.headless as boolean,
          mock: isMock,
          args: params.args
        });
        return { success: true, instance };
      }
      case 'ConnectBrowser': {
        const instance = await this.provider.connect(params.wsEndpoint, { mock: isMock });
        return { success: true, instance };
      }
      default:
        throw new Error(`Unsupported action: ${actionName}`);
    }
  }

  public async checkHealth(context: PluginContext, config: PluginConfiguration): Promise<PluginHealth> {
    // If we can launch or import playwright successfully
    try {
      if (config.settings?.mock) return { isHealthy: true, lastCheckedAt: new Date(), message: 'MOCK_ACTIVE' };
      
      const { chromium } = require('playwright-core');
      return { isHealthy: !!chromium, lastCheckedAt: new Date(), message: chromium ? 'ACTIVE' : 'MISSING_BINARIES' };
    } catch (e: any) {
      return { isHealthy: false, lastCheckedAt: new Date(), message: e.message };
    }
  }
}
