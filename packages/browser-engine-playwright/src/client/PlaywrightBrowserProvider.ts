import { BaseBrowserProvider } from '@rrss-auto/browser-engine-sdk';
import { BrowserProviderOptions, BrowserInstance } from '@rrss-auto/browser-sdk';
import { chromium, firefox, webkit, Browser as PWBrowser } from 'playwright-core';
import { PlaywrightInstance } from './PlaywrightInstance';

export class PlaywrightBrowserProvider extends BaseBrowserProvider {
  readonly providerId = 'playwright';

  protected async startNativeBrowser(options?: BrowserProviderOptions): Promise<BrowserInstance> {
    if (options?.mock) {
      return new PlaywrightInstance({} as PWBrowser, true);
    }
    
    // Default to chromium for now. Advanced logic would select browser via options
    const browser = await chromium.launch({
      headless: options?.headless !== false,
      args: options?.args
    });
    
    return new PlaywrightInstance(browser);
  }

  protected async connectNativeBrowser(wsEndpoint: string, options?: BrowserProviderOptions): Promise<BrowserInstance> {
    if (options?.mock) {
      return new PlaywrightInstance({} as PWBrowser, true);
    }
    
    const browser = await chromium.connect(wsEndpoint);
    return new PlaywrightInstance(browser);
  }
}
