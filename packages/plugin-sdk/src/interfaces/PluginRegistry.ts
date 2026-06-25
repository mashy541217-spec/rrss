import { Plugin } from './Plugin';

export interface PluginRegistry {
  register(plugin: Plugin): Promise<void>;
  unregister(pluginId: string): Promise<void>;
  getPlugin(pluginId: string): Plugin | null;
  getAllPlugins(): Plugin[];
  getSupportedPlugins(capability: string): Plugin[];
}
