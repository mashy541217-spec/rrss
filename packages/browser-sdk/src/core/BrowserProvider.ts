import { BrowserInstance } from './BrowserInstance';

export interface BrowserProviderOptions {
  headless?: boolean;
  proxy?: string;
  args?: string[];
  mock?: boolean;
}

export interface BrowserProvider {
  /** Provider identifier (e.g., 'playwright', 'puppeteer', 'selenium', 'fake') */
  readonly providerId: string;
  
  /** Launch a new local browser instance */
  launch(options?: BrowserProviderOptions): Promise<BrowserInstance>;
  
  /** Connect to an existing remote browser (e.g., Browserless, CDP) */
  connect(wsEndpoint: string, options?: BrowserProviderOptions): Promise<BrowserInstance>;
}
