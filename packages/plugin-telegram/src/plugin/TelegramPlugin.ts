import { Plugin, PluginContext, PluginConfiguration, PluginHealth } from '@rrss-auto/plugin-sdk';
import { TelegramManifest } from './TelegramManifest';
import { TelegramProvider } from './TelegramProvider';
import { TelegramHealthCheck } from '../health/TelegramHealthCheck';

export class TelegramPlugin implements Plugin {
  readonly manifest = TelegramManifest;
  private readonly provider: TelegramProvider;

  constructor(options?: { mock?: boolean }) {
    this.provider = new TelegramProvider(options);
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
    const token = config.credentials?.token || config.credentials?.botToken;
    const health = await TelegramHealthCheck.verify(token);
    return {
      isHealthy: health.isHealthy,
      lastCheckedAt: new Date(),
      message: health.status
    };
  }
}
