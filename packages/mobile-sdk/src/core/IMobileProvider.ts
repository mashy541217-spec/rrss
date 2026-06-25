import { IMobileSession } from './IMobileSession';
import { MobileDeviceProfile } from '../models/MobileDeviceProfile';

export interface IMobileProvider {
  /**
   * Discovers all devices currently connected via ADB or accessible to the provider.
   */
  getConnectedDevices(): Promise<MobileDeviceProfile[]>;

  /**
   * Establishes a new automation session on the target device.
   */
  createSession(deviceId: string): Promise<IMobileSession>;
}
