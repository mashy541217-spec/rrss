export interface IDesktopElement {
  click(): Promise<void>;
  doubleClick(): Promise<void>;
  rightClick(): Promise<void>;
  typeText(text: string): Promise<void>;
  getText(): Promise<string>;
  getAttribute(name: string): Promise<string | null>;
  isDisplayed(): Promise<boolean>;
  isEnabled(): Promise<boolean>;
  dragAndDrop(targetElement: IDesktopElement): Promise<void>;
}

export interface IDesktopLocator {
  findElement(selector: Record<string, any>): Promise<IDesktopElement>;
  findElements(selector: Record<string, any>): Promise<IDesktopElement[]>;
  waitForElement(selector: Record<string, any>, timeoutMs?: number): Promise<IDesktopElement>;
}
