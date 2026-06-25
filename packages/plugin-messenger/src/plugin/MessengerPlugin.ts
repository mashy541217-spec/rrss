import { Plugin, PluginContext, PluginConfiguration, PluginHealth } from '@rrss-auto/plugin-sdk';
import { MessengerManifest } from './MessengerManifest';
import { MessengerProvider } from './MessengerProvider';
import { MessengerHealthCheck } from '../health/MessengerHealthCheck';

export class MessengerPlugin implements Plugin {
  readonly manifest = MessengerManifest;
  private readonly provider: MessengerProvider;

  constructor(options?: { mock?: boolean }) {
    this.provider = new MessengerProvider(options);
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
    const token = config.credentials?.pageToken || config.credentials?.accessToken;
    const pageId = config.credentials?.pageId;
    const health = await MessengerHealthCheck.verify(token, pageId);
    return {
      isHealthy: health.isHealthy,
      lastCheckedAt: new Date(),
      message: health.status
    };
  }
}
