import { BrowserContext, BrowserPage } from '@rrss-auto/browser-sdk';
import { StealthManager } from '@rrss-auto/browser-engine-sdk';
import { BrowserContext as PWContext } from 'playwright-core';
import { PlaywrightPage } from './PlaywrightPage';

export class PlaywrightContext implements BrowserContext {
  private pagesList: BrowserPage[] = [];

  constructor(
    private readonly pwContext: PWContext, 
    private readonly isMock = false,
    private readonly stealthMode = false,
    private readonly fingerprintOptions?: {
      hardwareConcurrency?: number;
      deviceMemory?: number;
      platform?: string;
    }
  ) {
    if (!isMock && stealthMode) {
      // Inject our standard stealth patterns dynamically
      this.pwContext.addInitScript(StealthManager.getMaskingScript(fingerprintOptions)).catch(console.error);
    }
  }

  async newPage(): Promise<BrowserPage> {
    if (this.isMock) {
      const page = new PlaywrightPage({} as any, true);
      this.pagesList.push(page);
      return page;
    }

    const pwPage = await this.pwContext.newPage();
    const page = new PlaywrightPage(pwPage, false);
    this.pagesList.push(page);
    return page;
  }

  async pages(): Promise<BrowserPage[]> {
    if (this.isMock) return this.pagesList;
    
    // Re-map actual playwright pages
    const currentPages = this.pwContext.pages();
    return currentPages.map(p => new PlaywrightPage(p, false));
  }

  async close(): Promise<void> {
    if (!this.isMock) {
      await this.pwContext.close();
    }
  }

  async addCookies(cookies: any[]): Promise<void> {
    if (!this.isMock) await this.pwContext.addCookies(cookies);
  }

  async getCookies(): Promise<any[]> {
    if (this.isMock) return [];
    return await this.pwContext.cookies();
  }

  async clearCookies(): Promise<void> {
    if (!this.isMock) await this.pwContext.clearCookies();
  }
}
