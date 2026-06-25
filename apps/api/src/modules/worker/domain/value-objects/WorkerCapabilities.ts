export class WorkerCapabilities {
  constructor(
    public readonly installedPlugins: string[], // e.g. ['plugin-telegram', 'plugin-dealernet']
    public readonly browserEngines: string[],   // e.g. ['chromium', 'firefox']
    public readonly aiSupport: boolean,
    public readonly platform: string,           // e.g. 'linux', 'win32'
    public readonly architecture: string        // e.g. 'x64', 'arm64'
  ) {}

  canExecute(requiredPlugins: string[], requiredBrowser?: string): boolean {
    const hasPlugins = requiredPlugins.every(p => this.installedPlugins.includes(p));
    const hasBrowser = requiredBrowser ? this.browserEngines.includes(requiredBrowser) : true;
    return hasPlugins && hasBrowser;
  }
}
