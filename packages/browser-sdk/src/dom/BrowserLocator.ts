import { BrowserActionOptions } from './BrowserActionOptions';

/**
 * Modern chainable locator interface (inspired by Playwright).
 * Resolves elements lazily during action execution.
 */
export interface BrowserLocator {
  /** Chains another locator inside this one */
  locator(selector: string): BrowserLocator;

  /** Clicks the resolved element */
  click(options?: BrowserActionOptions): Promise<void>;

  /** Double clicks the resolved element */
  dblclick(options?: BrowserActionOptions): Promise<void>;

  /** Types text into the resolved element (keystroke by keystroke) */
  type(text: string, options?: BrowserActionOptions): Promise<void>;

  /** Fills text into the resolved element (instant) */
  fill(text: string, options?: BrowserActionOptions): Promise<void>;

  /** Hovers the mouse over the element */
  hover(options?: BrowserActionOptions): Promise<void>;

  /** Scrolls the element into view */
  scrollIntoViewIfNeeded(options?: BrowserActionOptions): Promise<void>;

  /** Retrieves the visible text content */
  textContent(options?: BrowserActionOptions): Promise<string | null>;

  /** Retrieves the inner HTML */
  innerHTML(options?: BrowserActionOptions): Promise<string>;

  /** Retrieves an attribute value */
  getAttribute(name: string, options?: BrowserActionOptions): Promise<string | null>;

  /** Checks if the element is currently visible */
  isVisible(options?: BrowserActionOptions): Promise<boolean>;

  /** Checks if the element is currently enabled */
  isEnabled(options?: BrowserActionOptions): Promise<boolean>;

  /** Takes a screenshot of just this element */
  screenshot(options?: { path?: string }): Promise<Buffer>;
}
