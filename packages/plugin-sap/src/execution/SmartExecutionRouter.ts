import { SapEnvironmentProfile } from '../discovery/SapEnvironmentProfile';

export enum SapExecutionStrategy {
  ODATA = 'ODATA',
  RFC = 'RFC',
  BAPI = 'BAPI',
  FIORI = 'FIORI',
  WEB_GUI = 'WEB_GUI',
  DESKTOP_GUI = 'DESKTOP_GUI'
}

export class SmartExecutionRouter {
  
  /**
   * Determines the optimal execution strategy based on the SAP environment capabilities.
   */
  route(profile: SapEnvironmentProfile, commandContext?: string): SapExecutionStrategy {
    console.log(`[SmartExecutionRouter] Evaluating optimal strategy for ${profile.version}...`);

    // 1. OData is the fastest and most modern (S/4HANA preferred)
    if (profile.availableApis.odata) {
      console.log(`[SmartExecutionRouter] Selected ODATA strategy.`);
      return SapExecutionStrategy.ODATA;
    }

    // 2. Fallback to classic RFC/BAPI
    if (profile.availableApis.bapi || profile.availableApis.rfc) {
      console.log(`[SmartExecutionRouter] Selected BAPI/RFC strategy.`);
      return SapExecutionStrategy.BAPI;
    }

    // 3. Fallback to Headless Web Interfaces
    if (profile.availableGuis.fiori) {
      console.log(`[SmartExecutionRouter] Selected FIORI (Browser) strategy.`);
      return SapExecutionStrategy.FIORI;
    }

    if (profile.availableGuis.webGui) {
      console.log(`[SmartExecutionRouter] Selected WebGUI (Browser) strategy.`);
      return SapExecutionStrategy.WEB_GUI;
    }

    // 4. Absolute last resort: Physical Desktop GUI Automation
    if (profile.availableGuis.desktopGui) {
      console.log(`[SmartExecutionRouter] Selected Desktop GUI strategy.`);
      return SapExecutionStrategy.DESKTOP_GUI;
    }

    throw new Error('No valid execution strategy available for this SAP environment.');
  }
}
