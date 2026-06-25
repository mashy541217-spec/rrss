export class StealthManager {
  /**
   * Returns a vanilla javascript string that should be evaluated 
   * in the browser page upon creation (e.g., page.addInitScript).
   */
  public static getMaskingScript(options?: {
    hardwareConcurrency?: number;
    deviceMemory?: number;
    platform?: string;
  }): string {
    return `
      // Mask webdriver
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      
      // Mask headless chrome properties
      window.chrome = { runtime: {} };
      
      // Mask permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission } as PermissionStatus) :
          originalQuery(parameters)
      );

      // Anti-detection fingerprint overrides
      ${options?.hardwareConcurrency ? `Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => ${options.hardwareConcurrency} });` : ''}
      ${options?.deviceMemory ? `Object.defineProperty(navigator, 'deviceMemory', { get: () => ${options.deviceMemory} });` : ''}
      ${options?.platform ? `Object.defineProperty(navigator, 'platform', { get: () => '${options.platform}' });` : ''}
    `;
  }
}
