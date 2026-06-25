import { Plugin, PluginContext, PluginConfiguration, PluginHealth } from '@rrss-auto/plugin-sdk';
import { SlackManifest } from './SlackManifest';
import { SlackProvider } from './SlackProvider';
import { SlackHealthCheck } from '../health/SlackHealthCheck';

export class SlackPlugin implements Plugin {
  readonly manifest = SlackManifest;
  private readonly provider: SlackProvider;

  constructor(options?: { mock?: boolean }) {
    this.provider = new SlackProvider(options);
  }

  public async executeAction(actionName: string, context: PluginContext, config: PluginConfiguration, params: Record<string, any>): Promise<any> {
    const credentials = config.credentials || {};

    switch (actionName) {
      case 'SendMessage': {
        const msg = await this.provider.sendMessage(params.conversationId, params.text, params.options, credentials);
        return { success: true, messageId: msg.id };
      }
      case 'SendMedia': {
        const msg = await this.provider.sendMedia(params.conversationId, params.mediaUrl, params.mediaType, params.options, credentials);
        return { success: true, messageId: msg.id };
      }
      default:
        throw new Error(`Unsupported action: ${actionName}`);
    }
  }

  public async checkHealth(context: PluginContext, config: PluginConfiguration): Promise<PluginHealth> {
    const token = config.credentials?.botToken || config.credentials?.token;
    const health = await SlackHealthCheck.verify(token);
    return {
      isHealthy: health.isHealthy,
      lastCheckedAt: new Date(),
      message: health.status
    };
  }
}
