import { BrowserProvider, BrowserProviderOptions } from '../core/BrowserProvider';
import { BrowserInstance } from '../core/BrowserInstance';
import { BrowserContext, BrowserContextOptions } from '../core/BrowserContext';
import { BrowserPage } from '../core/BrowserPage';
import { FakeBrowserPage } from './FakeBrowserPage';

export class FakeBrowserProvider implements BrowserProvider {
  readonly providerId = 'fake';

  async launch(options?: BrowserProviderOptions): Promise<BrowserInstance> {
    return new FakeBrowserInstance();
  }

  async connect(wsEndpoint: string, options?: BrowserProviderOptions): Promise<BrowserInstance> {
    return new FakeBrowserInstance();
  }
}

class FakeBrowserInstance implements BrowserInstance {
  readonly browserType = 'fake-chromium';

  async newContext(options?: BrowserContextOptions): Promise<BrowserContext> {
    return new FakeBrowserContext();
  }

  async close(): Promise<void> {}

  isConnected(): boolean { return true; }
}

class FakeBrowserContext implements BrowserContext {
  private pagesList: BrowserPage[] = [];

  async newPage(): Promise<BrowserPage> {
    const p = new FakeBrowserPage();
    this.pagesList.push(p);
    return p;
  }

  async pages(): Promise<BrowserPage[]> {
    return this.pagesList;
  }

  async close(): Promise<void> {}
  
  async addCookies(cookies: any[]): Promise<void> {}
  async getCookies(): Promise<any[]> { return []; }
  async clearCookies(): Promise<void> {}
}
