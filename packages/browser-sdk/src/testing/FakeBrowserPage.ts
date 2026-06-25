import { BrowserPage, BrowserPageOptions } from '../core/BrowserPage';
import { BrowserLocator } from '../dom/BrowserLocator';
import { FakeBrowserLocator } from './FakeBrowserLocator';

export class FakeBrowserPage implements BrowserPage {
  public url = 'about:blank';
  public actionHistory: string[] = [];

  async goto(url: string, options?: BrowserPageOptions): Promise<any> {
    this.url = url;
    this.actionHistory.push(`goto:${url}`);
    return null;
  }

  async reload(options?: BrowserPageOptions): Promise<any> {
    this.actionHistory.push(`reload`);
    return null;
  }

  async goBack(options?: BrowserPageOptions): Promise<any> {
    this.actionHistory.push(`goBack`);
    return null;
  }

  async evaluate<T>(pageFunction: string | ((...args: any[]) => T), ...args: any[]): Promise<T> {
    this.actionHistory.push(`evaluate`);
    return null as any;
  }

  locator(selector: string): BrowserLocator {
    return new FakeBrowserLocator(selector, this);
  }

  async screenshot(options?: { fullPage?: boolean; path?: string }): Promise<Buffer> {
    this.actionHistory.push(`screenshot`);
    return Buffer.from('fake-screenshot-data');
  }

  async pdf(options?: { format?: string; path?: string }): Promise<Buffer> {
    this.actionHistory.push(`pdf`);
    return Buffer.from('fake-pdf-data');
  }

  async close(): Promise<void> {
    this.actionHistory.push(`close`);
  }
}
