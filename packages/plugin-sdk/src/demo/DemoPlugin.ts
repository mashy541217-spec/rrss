import { Plugin } from '../interfaces/Plugin';
import { PluginManifest } from '../interfaces/PluginManifest';
import { PluginCapability } from '../interfaces/PluginCapability';
import { PluginConfiguration } from '../interfaces/PluginConfiguration';
import { PluginContext } from '../interfaces/PluginContext';
import { PluginHealth } from '../interfaces/PluginHealth';

export class DemoPlugin implements Plugin {
  public readonly manifest: PluginManifest = {
    id: 'demo-plugin',
    name: 'Demo Plugin',
    version: '1.0.0',
    description: 'Reference implementation proving dynamic loading works',
    capabilities: [PluginCapability.Publishing, PluginCapability.Messaging],
    metadata: {
      author: 'RRSS AUTO Core Team',
      license: 'MIT',
    },
  };

  private isEnabled: boolean = false;

  public async onInstall(context: PluginContext): Promise<void> {
    context.logger.info('DemoPlugin: onInstall hooks triggered successfully');
  }

  public async onEnable(context: PluginContext, config: PluginConfiguration): Promise<void> {
    this.isEnabled = true;
    context.logger.info('DemoPlugin: onEnable hooks triggered successfully', config.settings);
  }

  public async onDisable(context: PluginContext): Promise<void> {
    this.isEnabled = false;
    context.logger.info('DemoPlugin: onDisable hooks triggered successfully');
  }

  public async onUpgrade(context: PluginContext, oldVersion: string, newVersion: string): Promise<void> {
    context.logger.info(`DemoPlugin: Upgraded from ${oldVersion} to ${newVersion}`);
  }

  public async onRemove(context: PluginContext): Promise<void> {
    context.logger.info('DemoPlugin: onRemove hooks triggered successfully');
  }

  public async executeAction(
    actionName: string,
    context: PluginContext,
    config: PluginConfiguration,
    params: Record<string, any>
  ): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('Plugin is disabled');
    }

    context.logger.info(`DemoPlugin: Executing action: ${actionName} with params:`, params);

    switch (actionName) {
      case 'PublishContent':
        return {
          success: true,
          externalId: `ext-pub-${Date.now()}`,
          url: `https://demo-platform.example.com/posts/${Date.now()}`,
          metadata: { params, settings: config.settings },
        };
      case 'SendMessage':
        return {
          success: true,
          messageId: `msg-${Date.now()}`,
        };
      default:
        throw new Error(`Action ${actionName} is not supported by DemoPlugin`);
    }
  }

  public async checkHealth(context: PluginContext, config: PluginConfiguration): Promise<PluginHealth> {
    return {
      isHealthy: this.isEnabled,
      lastCheckedAt: new Date(),
      message: this.isEnabled ? 'Plugin is operating normally' : 'Plugin is disabled',
    };
  }
}
