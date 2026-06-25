import { BrowserPage, BrowserLocator } from '@rrss-auto/browser-sdk';

export abstract class BasePage {
  constructor(protected readonly page: BrowserPage) {}

  protected getLocator(selector: string): BrowserLocator {
    return this.page.locator(selector);
  }

  /** Implementations should define how to verify they are currently active */
  abstract waitForLoad(): Promise<void>;
}
