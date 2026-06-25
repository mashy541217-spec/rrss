import { IDesktopApplication } from './IDesktopApplication';

export interface IDesktopKeyboard {
  type(text: string): Promise<void>;
  press(key: string): Promise<void>;
  release(key: string): Promise<void>;
  hotkey(...keys: string[]): Promise<void>;
}

export interface IDesktopMouse {
  click(x: number, y: number): Promise<void>;
  doubleClick(x: number, y: number): Promise<void>;
  rightClick(x: number, y: number): Promise<void>;
  move(x: number, y: number): Promise<void>;
  dragAndDrop(startX: number, startY: number, endX: number, endY: number): Promise<void>;
}

export interface IDesktopClipboard {
  readText(): Promise<string>;
  writeText(text: string): Promise<void>;
  clear(): Promise<void>;
}

export interface IDesktopSession {
  sessionId: string;
  
  launchApplication(executablePath: string, args?: string[]): Promise<IDesktopApplication>;
  attachToApplication(processId: number): Promise<IDesktopApplication>;
  
  keyboard: IDesktopKeyboard;
  mouse: IDesktopMouse;
  clipboard: IDesktopClipboard;
  
  takeScreenshot(savePath?: string): Promise<Buffer>;
  close(): Promise<void>;
}

export interface IDesktopProvider {
  createSession(): Promise<IDesktopSession>;
}
