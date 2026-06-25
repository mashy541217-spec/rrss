import { IDesktopLocator } from './IDesktopElement';
import { WindowHandle } from '../models/WindowHandle';

export interface IDesktopWindow extends IDesktopLocator {
  handle: WindowHandle;
  
  focus(): Promise<void>;
  close(): Promise<void>;
  maximize(): Promise<void>;
  minimize(): Promise<void>;
  restore(): Promise<void>;
  resize(width: number, height: number): Promise<void>;
  move(x: number, y: number): Promise<void>;
  takeScreenshot(savePath?: string): Promise<Buffer>;
}
