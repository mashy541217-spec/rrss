export class StealthManager {
  /**
   * Returns a vanilla javascript string that should be evaluated 
   * in the browser page upon creation (e.g., page.addInitScript).
   */
  public static getMaskingScript(): string {
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
    `;
  }
}
