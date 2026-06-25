import { Plugin } from '../interfaces/Plugin';
import { PluginLoader } from '../interfaces/PluginLoader';
export declare class DefaultPluginLoader implements PluginLoader {
    load(pluginModuleOrInstance: any): Promise<Plugin>;
}
