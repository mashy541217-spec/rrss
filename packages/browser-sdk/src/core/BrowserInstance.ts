import { BrowserContext, BrowserContextOptions } from './BrowserContext';

export interface BrowserInstance {
  /** The specific browser engine (e.g., 'chromium', 'firefox', 'webkit') */
  readonly browserType: string;

  /** Create a new isolated context (incognito window equivalent) */
  newContext(options?: BrowserContextOptions): Promise<BrowserContext>;

  /** Close the browser and all associated contexts */
  close(): Promise<void>;

  /** Indicates if the browser is currently connected/alive */
  isConnected(): boolean;
}
