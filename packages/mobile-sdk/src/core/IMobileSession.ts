import { IMobileLocator } from './IMobileElement';
import { MobileContext } from '../models/MobileContext';

export interface IMobileSession extends IMobileLocator {
  // Application Management
  launchApplication(appPackage: string, activity?: string): Promise<void>;
  closeApplication(appPackage: string): Promise<void>;
  installAPK(apkPath: string): Promise<void>;
  uninstallAPK(appPackage: string): Promise<void>;
  clearApplicationData(appPackage: string): Promise<void>;

  // Context Management
  switchContext(context: MobileContext | string): Promise<void>;
  getContexts(): Promise<string[]>;
  getCurrentContext(): Promise<string>;

  // Screen Actions
  swipe(startX: number, startY: number, endX: number, endY: number, durationMs?: number): Promise<void>;
  scroll(direction: 'up' | 'down' | 'left' | 'right'): Promise<void>;
  takeScreenshot(savePath?: string): Promise<Buffer>;
  startScreenRecording(): Promise<void>;
  stopScreenRecording(savePath: string): Promise<void>;

  // OS Actions
  grantPermission(appPackage: string, permission: string): Promise<void>;
  revokePermission(appPackage: string, permission: string): Promise<void>;
  executeAdbCommand(command: string): Promise<string>;
  
  // Lifecycle
  close(): Promise<void>;
}
