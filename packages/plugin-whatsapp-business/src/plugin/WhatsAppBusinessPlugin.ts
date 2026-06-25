import { Plugin, PluginContext, PluginConfiguration, PluginHealth } from '@rrss-auto/plugin-sdk';
import { WhatsAppBusinessManifest } from './WhatsAppBusinessManifest';
import { WhatsAppBusinessProvider } from './WhatsAppBusinessProvider';
import { WhatsAppHealthCheck } from '../health/WhatsAppHealthCheck';

export class WhatsAppBusinessPlugin implements Plugin {
  readonly manifest = WhatsAppBusinessManifest;
  private readonly provider: WhatsAppBusinessProvider;

  constructor(options?: { mock?: boolean }) {
    this.provider = new WhatsAppBusinessProvider(options);
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
    const token = config.credentials?.accessToken;
    const phoneNumberId = config.credentials?.phoneNumberId;
    const health = await WhatsAppHealthCheck.verify(token, phoneNumberId);
    return {
      isHealthy: health.isHealthy,
      lastCheckedAt: new Date(),
      message: health.status
    };
  }
}
