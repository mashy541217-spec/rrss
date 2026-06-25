import { BrowserPage, BrowserPageOptions, BrowserLocator } from '@rrss-auto/browser-sdk';
import { ErrorMapper } from '@rrss-auto/browser-engine-sdk';
import { Page as PWPage } from 'playwright-core';
import { PlaywrightLocator } from './PlaywrightLocator';

export class PlaywrightPage implements BrowserPage {
  constructor(private readonly pwPage: PWPage, private readonly isMock = false) {}

  async goto(url: string, options?: BrowserPageOptions): Promise<any> {
    if (this.isMock) return null;
    try {
      return await this.pwPage.goto(url, { waitUntil: options?.waitUntil, timeout: options?.timeoutMs });
    } catch (err) {
      throw ErrorMapper.mapEngineError(err);
    }
  }

  async reload(options?: BrowserPageOptions): Promise<any> {
    if (this.isMock) return null;
    try {
      return await this.pwPage.reload({ waitUntil: options?.waitUntil, timeout: options?.timeoutMs });
    } catch (err) {
      throw ErrorMapper.mapEngineError(err);
    }
  }

  async goBack(options?: BrowserPageOptions): Promise<any> {
    if (this.isMock) return null;
    try {
      return await this.pwPage.goBack({ waitUntil: options?.waitUntil, timeout: options?.timeoutMs });
    } catch (err) {
      throw ErrorMapper.mapEngineError(err);
    }
  }

  async evaluate<T>(pageFunction: string | ((...args: any[]) => T), ...args: any[]): Promise<T> {
    if (this.isMock) return null as any;
    try {
      return await this.pwPage.evaluate(pageFunction as any, ...args);
    } catch (err) {
      throw ErrorMapper.mapEngineError(err);
    }
  }

  locator(selector: string): BrowserLocator {
    if (this.isMock) {
      return new PlaywrightLocator({} as any, selector, true);
    }
    return new PlaywrightLocator(this.pwPage.locator(selector), selector, false);
  }

  async screenshot(options?: { fullPage?: boolean; path?: string }): Promise<Buffer> {
    if (this.isMock) return Buffer.from('mock');
    return await this.pwPage.screenshot({ fullPage: options?.fullPage, path: options?.path });
  }

  async pdf(options?: { format?: string; path?: string }): Promise<Buffer> {
    if (this.isMock) return Buffer.from('mock');
    return await this.pwPage.pdf({ path: options?.path });
  }

  async close(): Promise<void> {
    if (!this.isMock) await this.pwPage.close();
  }
}
