export interface IMobileElement {
  tap(): Promise<void>;
  doubleTap(): Promise<void>;
  longPress(durationMs?: number): Promise<void>;
  typeText(text: string): Promise<void>;
  clearText(): Promise<void>;
  getText(): Promise<string>;
  getAttribute(name: string): Promise<string | null>;
  isDisplayed(): Promise<boolean>;
  isEnabled(): Promise<boolean>;
}

export interface IMobileLocator {
  findElement(selector: string): Promise<IMobileElement>;
  findElements(selector: string): Promise<IMobileElement[]>;
  waitForElement(selector: string, timeoutMs?: number): Promise<IMobileElement>;
}
