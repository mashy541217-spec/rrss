import { IMobileProvider } from '../core/IMobileProvider';
import { IMobileSession } from '../core/IMobileSession';
import { IMobileElement } from '../core/IMobileElement';
import { MobileDeviceProfile } from '../models/MobileDeviceProfile';
import { MobileContext } from '../models/MobileContext';

class AppiumMobileElement implements IMobileElement {
  constructor(private readonly elementId: string) {}

  async tap(): Promise<void> { console.log(`[Appium] Tapping element ${this.elementId}`); }
  async doubleTap(): Promise<void> {}
  async longPress(durationMs?: number): Promise<void> {}
  async typeText(text: string): Promise<void> { console.log(`[Appium] Typing "${text}" into element ${this.elementId}`); }
  async clearText(): Promise<void> {}
  async getText(): Promise<string> { return 'Mock Text'; }
  async getAttribute(name: string): Promise<string | null> { return null; }
  async isDisplayed(): Promise<boolean> { return true; }
  async isEnabled(): Promise<boolean> { return true; }
}

class AppiumMobileSession implements IMobileSession {
  constructor(private readonly deviceId: string) {}

  async findElement(selector: string): Promise<IMobileElement> { return new AppiumMobileElement('mock-element-id'); }
  async findElements(selector: string): Promise<IMobileElement[]> { return []; }
  async waitForElement(selector: string, timeoutMs?: number): Promise<IMobileElement> { return new AppiumMobileElement('mock-element-id'); }

  async launchApplication(appPackage: string, activity?: string): Promise<void> { console.log(`[Appium] Launching ${appPackage} on ${this.deviceId}`); }
  async closeApplication(appPackage: string): Promise<void> {}
  async installAPK(apkPath: string): Promise<void> {}
  async uninstallAPK(appPackage: string): Promise<void> {}
  async clearApplicationData(appPackage: string): Promise<void> { console.log(`[Appium] Cleared data for ${appPackage}`); }

  async switchContext(context: MobileContext | string): Promise<void> { console.log(`[Appium] Switching context to ${context}`); }
  async getContexts(): Promise<string[]> { return [MobileContext.NATIVE_APP, MobileContext.WEBVIEW]; }
  async getCurrentContext(): Promise<string> { return MobileContext.NATIVE_APP; }

  async swipe(startX: number, startY: number, endX: number, endY: number, durationMs?: number): Promise<void> {}
  async scroll(direction: 'up' | 'down' | 'left' | 'right'): Promise<void> {}
  async takeScreenshot(savePath?: string): Promise<Buffer> { return Buffer.from([]); }
  async startScreenRecording(): Promise<void> {}
  async stopScreenRecording(savePath: string): Promise<void> {}

  async grantPermission(appPackage: string, permission: string): Promise<void> {}
  async revokePermission(appPackage: string, permission: string): Promise<void> {}
  async executeAdbCommand(command: string): Promise<string> { return ''; }

  async close(): Promise<void> { console.log(`[Appium] Session closed on ${this.deviceId}`); }
}

export class AppiumMobileProvider implements IMobileProvider {
  async getConnectedDevices(): Promise<MobileDeviceProfile[]> {
    // Mock response simulating an ADB devices call
    return [
      {
        deviceId: 'emulator-5554',
        manufacturer: 'Google',
        model: 'Pixel 6 Pro',
        androidVersion: '13.0',
        apiLevel: 33,
        architecture: 'x86_64',
        cpuCores: 4,
        ramMb: 4096,
        resolution: '1440x3120',
        density: 560,
        hasPlayServices: true,
        isRooted: true,
        isEmulator: true
      }
    ];
  }

  async createSession(deviceId: string): Promise<IMobileSession> {
    console.log(`[Appium] Creating new session on device ${deviceId}`);
    return new AppiumMobileSession(deviceId);
  }
}
