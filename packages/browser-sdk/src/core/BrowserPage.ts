import { BrowserLocator } from '../dom/BrowserLocator';

export interface BrowserPageOptions {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  timeoutMs?: number;
}

export interface BrowserPage {
  /** Navigates to a specific URL */
  goto(url: string, options?: BrowserPageOptions): Promise<any>;

  /** Refreshes the page */
  reload(options?: BrowserPageOptions): Promise<any>;

  /** Navigates back in history */
  goBack(options?: BrowserPageOptions): Promise<any>;

  /** Executes arbitrary JS in the page context */
  evaluate<T>(pageFunction: string | ((...args: any[]) => T), ...args: any[]): Promise<T>;

  /** Retrieves a chainable locator for DOM operations */
  locator(selector: string): BrowserLocator;

  /** Takes a screenshot of the entire viewport or page */
  screenshot(options?: { fullPage?: boolean; path?: string }): Promise<Buffer>;

  /** Generates a PDF of the page (headless Chromium only usually) */
  pdf(options?: { format?: string; path?: string }): Promise<Buffer>;

  /** Closes the page */
  close(): Promise<void>;
}
