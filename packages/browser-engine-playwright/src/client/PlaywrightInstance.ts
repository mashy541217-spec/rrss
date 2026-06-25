import { BrowserInstance, BrowserContextOptions, BrowserContext } from '@rrss-auto/browser-sdk';
import { Browser as PWBrowser } from 'playwright-core';
import { PlaywrightContext } from './PlaywrightContext';

export class PlaywrightInstance implements BrowserInstance {
  readonly browserType = 'playwright-chromium';

  constructor(private readonly pwBrowser: PWBrowser, private readonly isMock = false) {}

  async newContext(options?: BrowserContextOptions): Promise<BrowserContext> {
    if (this.isMock) {
      return new PlaywrightContext({} as any, true);
    }

    const context = await this.pwBrowser.newContext({
      userAgent: options?.userAgent,
      viewport: options?.viewport,
      geolocation: options?.geolocation,
      locale: options?.locale,
      timezoneId: options?.timezoneId,
      permissions: options?.permissions
    });
    return new PlaywrightContext(context, false, options?.stealthMode);
  }

  async close(): Promise<void> {
    if (!this.isMock) {
      await this.pwBrowser.close();
    }
  }

  isConnected(): boolean {
    if (this.isMock) return true;
    return this.pwBrowser.isConnected();
  }
}
