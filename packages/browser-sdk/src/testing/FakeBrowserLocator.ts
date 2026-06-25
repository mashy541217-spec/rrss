import { BrowserLocator } from '../dom/BrowserLocator';
import { BrowserActionOptions } from '../dom/BrowserActionOptions';
import { FakeBrowserPage } from './FakeBrowserPage';

export class FakeBrowserLocator implements BrowserLocator {
  constructor(private readonly selector: string, private readonly page: FakeBrowserPage) {}

  locator(selector: string): BrowserLocator {
    return new FakeBrowserLocator(`${this.selector} >> ${selector}`, this.page);
  }

  async click(options?: BrowserActionOptions): Promise<void> {
    this.page.actionHistory.push(`click:${this.selector}`);
  }

  async dblclick(options?: BrowserActionOptions): Promise<void> {
    this.page.actionHistory.push(`dblclick:${this.selector}`);
  }

  async type(text: string, options?: BrowserActionOptions): Promise<void> {
    this.page.actionHistory.push(`type:${this.selector}:${text}`);
  }

  async fill(text: string, options?: BrowserActionOptions): Promise<void> {
    this.page.actionHistory.push(`fill:${this.selector}:${text}`);
  }

  async hover(options?: BrowserActionOptions): Promise<void> {
    this.page.actionHistory.push(`hover:${this.selector}`);
  }

  async scrollIntoViewIfNeeded(options?: BrowserActionOptions): Promise<void> {
    this.page.actionHistory.push(`scrollIntoViewIfNeeded:${this.selector}`);
  }

  async textContent(options?: BrowserActionOptions): Promise<string | null> {
    return 'fake-text';
  }

  async innerHTML(options?: BrowserActionOptions): Promise<string> {
    return '<div>fake</div>';
  }

  async getAttribute(name: string, options?: BrowserActionOptions): Promise<string | null> {
    return 'fake-attribute';
  }

  async isVisible(options?: BrowserActionOptions): Promise<boolean> {
    if (this.selector.includes('.alert-danger') || this.selector.includes('.no-results-found')) {
      return false;
    }
    return true;
  }

  async isEnabled(options?: BrowserActionOptions): Promise<boolean> {
    return true;
  }

  async screenshot(options?: { path?: string }): Promise<Buffer> {
    this.page.actionHistory.push(`locatorScreenshot:${this.selector}`);
    return Buffer.from('fake-locator-screenshot');
  }
}
