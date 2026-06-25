import { IDesktopWindow } from './IDesktopWindow';

export interface IDesktopApplication {
  processId: number;
  executablePath: string;
  
  getMainWindow(): Promise<IDesktopWindow>;
  getWindows(): Promise<IDesktopWindow[]>;
  waitForWindow(titleOrClass: string, timeoutMs?: number): Promise<IDesktopWindow>;
  close(): Promise<void>;
  kill(): Promise<void>;
}
