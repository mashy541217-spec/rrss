export interface BrowserFingerprint {
  userAgent: string;
  viewport: { width: number; height: number };
  locale: string;
  timezoneId: string;
  hardwareConcurrency: number;
  deviceMemory: number;
  platform: string;
  deviceScaleFactor: number;
}

export class FingerprintGenerator {
  private static readonly USER_AGENTS_DESKTOP = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.2; rv:121.0) Gecko/20100101 Firefox/121.0'
  ];

  private static readonly USER_AGENTS_MOBILE = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  ];

  private static readonly VIEWPORTS_DESKTOP = [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1536, height: 864 },
    { width: 1366, height: 768 }
  ];

  private static readonly VIEWPORTS_MOBILE = [
    { width: 390, height: 844 }, // iPhone 12/13/14
    { width: 412, height: 915 }, // Galaxy S20
    { width: 375, height: 667 }  // iPhone SE
  ];

  /**
   * Generates a realistic browser fingerprint based on platform category and preferences.
   */
  public static generate(options?: { isMobile?: boolean; locale?: string; timezone?: string }): BrowserFingerprint {
    const isMobile = !!options?.isMobile;
    
    const userAgentList = isMobile ? this.USER_AGENTS_MOBILE : this.USER_AGENTS_DESKTOP;
    const viewportList = isMobile ? this.VIEWPORTS_MOBILE : this.VIEWPORTS_DESKTOP;

    const userAgent = userAgentList[Math.floor(Math.random() * userAgentList.length)];
    const viewport = viewportList[Math.floor(Math.random() * viewportList.length)];
    
    const locale = options?.locale || 'en-US';
    const timezoneId = options?.timezone || 'America/New_York';
    
    const hardwareConcurrency = [4, 6, 8, 12, 16][Math.floor(Math.random() * 5)];
    const deviceMemory = [4, 8, 16, 32][Math.floor(Math.random() * 4)];
    
    let platform = 'Win32';
    if (userAgent.includes('Macintosh')) {
      platform = 'MacIntel';
    } else if (userAgent.includes('iPhone')) {
      platform = 'iPhone';
    } else if (userAgent.includes('Linux')) {
      platform = 'Linux armv8l';
    }

    const deviceScaleFactor = isMobile ? 3 : 1;

    return {
      userAgent,
      viewport,
      locale,
      timezoneId,
      hardwareConcurrency,
      deviceMemory,
      platform,
      deviceScaleFactor
    };
  }
}
