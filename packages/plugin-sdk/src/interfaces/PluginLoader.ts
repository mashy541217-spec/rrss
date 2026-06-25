import { Plugin } from './Plugin';

export interface PluginLoader {
  load(pluginPathOrModule: string): Promise<Plugin>;
}
