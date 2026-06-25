import { IPlugin, PluginContext } from '@rrss-auto/plugin-sdk';
import { SmartExecutionRouter, SapExecutionStrategy } from './execution/SmartExecutionRouter';
import { SapDiscoveryService } from './discovery/SapDiscoveryService';
import { SapRfcAdapter, SapGuiAdapter } from './adapters/SapAdapters';

export class SapPlugin implements IPlugin {
  id = 'plugin-sap-enterprise';
  name = 'SAP Enterprise';
  version = '1.0.0';

  private router = new SmartExecutionRouter();
  private discovery = new SapDiscoveryService();
  
  private rfcAdapter = new SapRfcAdapter();
  private guiAdapter = new SapGuiAdapter();

  async initialize(context: PluginContext): Promise<void> {
    console.log(`[SapPlugin] Initialized.`);
  }

  /**
   * Universal entry point for workflows. The workflow passes the intent,
   * the plugin figures out HOW to execute it against SAP.
   */
  async executeIntent(intentName: string, payload: any, credentials: any, host: string): Promise<any> {
    // 1. Discover capabilities
    const profile = await this.discovery.probeEnvironment(credentials, host);

    // 2. Route strategy
    const strategy = this.router.route(profile);

    // 3. Execute
    switch (strategy) {
      case SapExecutionStrategy.BAPI:
      case SapExecutionStrategy.RFC:
        return await this.rfcAdapter.executeCommand(intentName, payload);
      case SapExecutionStrategy.DESKTOP_GUI:
        return await this.guiAdapter.executeCommand(intentName, payload);
      default:
        throw new Error(`Execution strategy ${strategy} not fully implemented yet.`);
    }
  }
}
