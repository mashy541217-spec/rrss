import { MobileDeviceProfile } from '../models/MobileDeviceProfile';
import { IMobileSession } from '../core/IMobileSession';
import { IMobileProvider } from '../core/IMobileProvider';

export class DevicePoolManager {
  private activeSessions: Map<string, IMobileSession> = new Map();
  private availableDevices: MobileDeviceProfile[] = [];

  constructor(private readonly provider: IMobileProvider) {}

  /**
   * Discovers and adds all connected devices to the available pool.
   */
  async discoverDevices(): Promise<MobileDeviceProfile[]> {
    this.availableDevices = await this.provider.getConnectedDevices();
    console.log(`[DevicePool] Discovered ${this.availableDevices.length} devices.`);
    return this.availableDevices;
  }

  /**
   * Reserves a device from the pool and creates a new isolated session.
   */
  async reserveDevice(executionId: string, requiredProfile?: Partial<MobileDeviceProfile>): Promise<IMobileSession> {
    // Basic reservation logic. In reality, it would match requiredProfile constraints.
    const device = this.availableDevices.pop();
    
    if (!device) {
      throw new Error('DevicePool Exhausted: No available devices.');
    }

    console.log(`[DevicePool] Reserving device ${device.deviceId} for execution ${executionId}`);
    
    // Create the session
    const session = await this.provider.createSession(device.deviceId);
    this.activeSessions.set(executionId, session);

    // Force wipe data to mimic "Incognito" isolation
    // session.clearApplicationData('com.example.app');

    return session;
  }

  /**
   * Releases a device back to the pool and destroys the session.
   */
  async releaseDevice(executionId: string, deviceId: string): Promise<void> {
    const session = this.activeSessions.get(executionId);
    if (session) {
      console.log(`[DevicePool] Closing session for execution ${executionId}`);
      await session.close();
      this.activeSessions.delete(executionId);
    }
    
    // Retrieve device profile and return it to available pool
    const devices = await this.provider.getConnectedDevices();
    const releasedDevice = devices.find(d => d.deviceId === deviceId);
    if (releasedDevice) {
      this.availableDevices.push(releasedDevice);
      console.log(`[DevicePool] Released device ${deviceId} back to pool.`);
    }
  }

  getPoolMetrics() {
    return {
      activeSessions: this.activeSessions.size,
      availableDevices: this.availableDevices.length
    };
  }
}
