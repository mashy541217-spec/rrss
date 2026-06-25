import { BrowserPage } from './BrowserPage';

export interface BrowserContextOptions {
  userAgent?: string;
  viewport?: { width: number; height: number };
  geolocation?: { latitude: number; longitude: number };
  locale?: string;
  timezoneId?: string;
  permissions?: string[];
  stealthMode?: boolean; // Generic humanization trigger
}

export interface BrowserContext {
  /** Creates a new page/tab within this context */
  newPage(): Promise<BrowserPage>;

  /** Retrieves all currently open pages in this context */
  pages(): Promise<BrowserPage[]>;

  /** Closes the context and all associated pages */
  close(): Promise<void>;

  /** Expose generic storage capabilities */
  addCookies(cookies: any[]): Promise<void>;
  getCookies(): Promise<any[]>;
  clearCookies(): Promise<void>;
}
