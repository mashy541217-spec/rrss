import { IDesktopApplication } from '../core/IDesktopApplication';

export class DesktopRecoveryService {
  /**
   * Attempts to forcefully kill a stalled application if it stops responding to UI automation.
   */
  async recoverApplication(app: IDesktopApplication): Promise<boolean> {
    console.log(`[DesktopRecovery] Application PID ${app.processId} is stalled. Attempting recovery...`);
    
    try {
      // Hard kill the process
      await app.kill();
      console.log(`[DesktopRecovery] Successfully killed PID ${app.processId}. Workflow will need to restart the application.`);
      return true;
    } catch (error) {
      console.error(`[DesktopRecovery] Failed to kill PID ${app.processId}. Requires manual intervention.`);
      return false;
    }
  }
}
