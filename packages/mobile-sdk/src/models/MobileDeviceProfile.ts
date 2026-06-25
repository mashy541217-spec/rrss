export interface MobileDeviceProfile {
  deviceId: string; // ADB Serial or Appium udid
  manufacturer: string;
  model: string;
  androidVersion: string;
  apiLevel: number;
  architecture: string; // e.g. arm64-v8a
  cpuCores: number;
  ramMb: number;
  resolution: string; // e.g. 1080x2400
  density: number; // e.g. 480
  hasPlayServices: boolean;
  isRooted: boolean;
  isEmulator: boolean;
  adbIdentifier?: string;
}
