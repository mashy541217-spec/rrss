import { BrowserProvider, BrowserProviderOptions, BrowserInstance } from '@rrss-auto/browser-sdk';

export abstract class BaseBrowserProvider implements BrowserProvider {
  abstract providerId: string;

  /** Implementations must define how the raw driver starts */
  protected abstract startNativeBrowser(options?: BrowserProviderOptions): Promise<BrowserInstance>;
  
  protected abstract connectNativeBrowser(wsEndpoint: string, options?: BrowserProviderOptions): Promise<BrowserInstance>;

  public async launch(options?: BrowserProviderOptions): Promise<BrowserInstance> {
    try {
      return await this.startNativeBrowser(options);
    } catch (err: any) {
      throw new Error(`Failed to launch browser: ${err.message}`);
    }
  }

  public async connect(wsEndpoint: string, options?: BrowserProviderOptions): Promise<BrowserInstance> {
    try {
      return await this.connectNativeBrowser(wsEndpoint, options);
    } catch (err: any) {
      throw new Error(`Failed to connect browser: ${err.message}`);
    }
  }
}
