import { Plugin } from '../interfaces/Plugin';
import { PluginLoader } from '../interfaces/PluginLoader';

export class DefaultPluginLoader implements PluginLoader {
  public async load(pluginModuleOrInstance: any): Promise<Plugin> {
    if (!pluginModuleOrInstance) {
      throw new Error('Plugin module or instance is required');
    }

    let plugin: Plugin;
    if (typeof pluginModuleOrInstance === 'function') {
      plugin = new pluginModuleOrInstance();
    } else {
      plugin = pluginModuleOrInstance as Plugin;
    }

    if (!plugin.manifest || !plugin.manifest.id || !plugin.executeAction) {
      throw new Error('Invalid plugin format: missing manifest or executeAction method');
    }

    return plugin;
  }
}
