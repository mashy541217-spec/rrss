import { Plugin, PluginContext, PluginConfiguration, PluginHealth } from '@rrss-auto/plugin-sdk';
import { BrowserProvider } from '@rrss-auto/browser-sdk';
import { DealerNetManifest } from './DealerNetManifest';
import { AuthenticationWorkflow } from '../workflows/AuthenticationWorkflow';
import { CustomerReportWorkflow } from '../workflows/CustomerReportWorkflow';

export class DealerNetPlugin implements Plugin {
  readonly manifest = DealerNetManifest;

  public async executeAction(actionName: string, context: PluginContext, config: PluginConfiguration, params: Record<string, any>): Promise<any> {
    // Note: In real life, Execution Engine passes the BrowserProvider via context or DI.
    // For this mock architecture, we assume it's passed in params for simplicity.
    const provider: BrowserProvider = params.provider;
    if (!provider) throw new Error('BrowserProvider must be injected to use DealerNetPlugin');

    const instance = await provider.launch({ mock: params.mock });
    const browserContext = await instance.newContext();
    const page = await browserContext.newPage();

    try {
      switch (actionName) {
        case 'Login': {
          const auth = new AuthenticationWorkflow(page);
          await auth.execute(params.username, params.password);
          return { success: true };
        }
        case 'GenerateReport': {
          const report = new CustomerReportWorkflow(page);
          const result = await report.execute(params.rut);
          return { success: true, ...result };
        }
        default:
          throw new Error(`Unsupported action: ${actionName}`);
      }
    } finally {
      await browserContext.close();
      await instance.close();
    }
  }

  public async checkHealth(context: PluginContext, config: PluginConfiguration): Promise<PluginHealth> {
    return { isHealthy: true, lastCheckedAt: new Date(), message: 'DEALERNET_READY' };
  }
}
