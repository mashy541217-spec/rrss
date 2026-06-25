export interface BrowserStorage {
  /** Cookies management */
  addCookies(cookies: any[]): Promise<void>;
  getCookies(): Promise<any[]>;
  clearCookies(): Promise<void>;

  /** LocalStorage management */
  setLocalStorageItem(key: string, value: string): Promise<void>;
  getLocalStorageItem(key: string): Promise<string | null>;
  clearLocalStorage(): Promise<void>;

  /** SessionStorage management */
  setSessionStorageItem(key: string, value: string): Promise<void>;
  getSessionStorageItem(key: string): Promise<string | null>;
  clearSessionStorage(): Promise<void>;
}
