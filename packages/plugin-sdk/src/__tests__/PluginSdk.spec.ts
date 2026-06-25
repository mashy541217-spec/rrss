import { DefaultPluginLoader } from '../registry/DefaultPluginLoader';
import { DefaultPluginRegistry } from '../registry/DefaultPluginRegistry';
import { DemoPlugin } from '../demo/DemoPlugin';
import { PluginCapability } from '../interfaces/PluginCapability';

describe('Plugin SDK Foundation', () => {
  let loader: DefaultPluginLoader;
  let registry: DefaultPluginRegistry;
  let context: any;

  beforeEach(() => {
    loader = new DefaultPluginLoader();
    registry = new DefaultPluginRegistry();
    context = {
      logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      },
      environment: {},
      services: {
        get: jest.fn(),
      },
    };
  });

  it('should load DemoPlugin using DefaultPluginLoader', async () => {
    const plugin = await loader.load(DemoPlugin);
    expect(plugin.manifest.id).toBe('demo-plugin');
    expect(plugin.manifest.capabilities).toContain(PluginCapability.Publishing);
  });

  it('should register and retrieve plugins from registry', async () => {
    const plugin = await loader.load(new DemoPlugin());
    await registry.register(plugin);

    expect(registry.getPlugin('demo-plugin')).toBe(plugin);
    expect(registry.getAllPlugins().length).toBe(1);

    const pubPlugins = registry.getSupportedPlugins('Publishing');
    expect(pubPlugins).toContain(plugin);

    const crmPlugins = registry.getSupportedPlugins('CRM');
    expect(crmPlugins.length).toBe(0);

    await registry.unregister('demo-plugin');
    expect(registry.getPlugin('demo-plugin')).toBeNull();
  });

  it('should run lifecycle hooks and execute actions on DemoPlugin', async () => {
    const plugin = await loader.load(DemoPlugin);

    await plugin.onInstall?.(context);
    expect(context.logger.info).toHaveBeenCalledWith(expect.stringContaining('onInstall hooks triggered'));

    const config = { settings: { apiKey: 'test-key' } };

    await expect(
      plugin.executeAction('PublishContent', context, config, { body: 'hello' })
    ).rejects.toThrow('Plugin is disabled');

    await plugin.onEnable?.(context, config);
    expect(context.logger.info).toHaveBeenCalledWith(expect.stringContaining('onEnable hooks triggered'), config.settings);

    const health = await plugin.checkHealth?.(context, config);
    expect(health?.isHealthy).toBe(true);

    const publishResult = await plugin.executeAction('PublishContent', context, config, {
      contentId: '123',
      body: 'Hello World',
    });
    expect(publishResult.success).toBe(true);
    expect(publishResult.externalId).toBeDefined();

    const sendResult = await plugin.executeAction('SendMessage', context, config, {
      recipientId: 'user-1',
      text: 'Hello User',
    });
    expect(sendResult.success).toBe(true);

    await plugin.onDisable?.(context);
    expect(context.logger.info).toHaveBeenCalledWith(expect.stringContaining('onDisable hooks triggered'));
  });
});
