import { BaseBrowserLocator } from '@rrss-auto/browser-engine-sdk';
import { BrowserLocator, BrowserActionOptions } from '@rrss-auto/browser-sdk';
import { Locator as PWLocator } from 'playwright-core';

export class PlaywrightLocator extends BaseBrowserLocator {
  // We keep a history for mock verification
  public mockHistory: string[] = [];

  constructor(
    private readonly pwLocator: PWLocator, 
    selector: string,
    private readonly isMock = false
  ) {
    super(selector);
  }

  locator(selector: string): BrowserLocator {
    if (this.isMock) {
      const nested = new PlaywrightLocator({} as any, `${this.selector} >> ${selector}`, true);
      nested.mockHistory = this.mockHistory;
      return nested;
    }
    return new PlaywrightLocator(this.pwLocator.locator(selector), `${this.selector} >> ${selector}`, false);
  }

  protected async doNativeClick(options?: BrowserActionOptions): Promise<void> {
    if (this.isMock) {
      this.mockHistory.push(`nativeClick:${this.selector}`);
      return;
    }
    await this.pwLocator.click({ 
      force: options?.force, 
      timeout: options?.timeoutMs 
    });
  }

  protected async doNativeType(text: string, delayMs: number): Promise<void> {
    if (this.isMock) {
      this.mockHistory.push(`nativeType:${this.selector}:${text}:${delayMs}`);
      return;
    }
    await this.pwLocator.pressSequentially(text, { delay: delayMs });
  }

  async dblclick(options?: BrowserActionOptions): Promise<void> {
    if (this.isMock) return;
    await this.pwLocator.dblclick({ force: options?.force, timeout: options?.timeoutMs });
  }

  async fill(text: string, options?: BrowserActionOptions): Promise<void> {
    if (this.isMock) return;
    await this.pwLocator.fill(text, { force: options?.force, timeout: options?.timeoutMs });
  }

  async hover(options?: BrowserActionOptions): Promise<void> {
    if (this.isMock) return;
    await this.pwLocator.hover({ force: options?.force, timeout: options?.timeoutMs });
  }

  async scrollIntoViewIfNeeded(options?: BrowserActionOptions): Promise<void> {
    if (this.isMock) return;
    await this.pwLocator.scrollIntoViewIfNeeded({ timeout: options?.timeoutMs });
  }

  async textContent(options?: BrowserActionOptions): Promise<string | null> {
    if (this.isMock) return 'mock';
    return await this.pwLocator.textContent({ timeout: options?.timeoutMs });
  }

  async innerHTML(options?: BrowserActionOptions): Promise<string> {
    if (this.isMock) return 'mock';
    return await this.pwLocator.innerHTML({ timeout: options?.timeoutMs });
  }

  async getAttribute(name: string, options?: BrowserActionOptions): Promise<string | null> {
    if (this.isMock) return 'mock';
    return await this.pwLocator.getAttribute(name, { timeout: options?.timeoutMs });
  }

  async isVisible(options?: BrowserActionOptions): Promise<boolean> {
    if (this.isMock) return true;
    return await this.pwLocator.isVisible({ timeout: options?.timeoutMs });
  }

  async isEnabled(options?: BrowserActionOptions): Promise<boolean> {
    if (this.isMock) return true;
    return await this.pwLocator.isEnabled({ timeout: options?.timeoutMs });
  }

  async screenshot(options?: { path?: string }): Promise<Buffer> {
    if (this.isMock) return Buffer.from('mock');
    return await this.pwLocator.screenshot({ path: options?.path });
  }
}
