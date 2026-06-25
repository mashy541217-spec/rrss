import { Plugin } from '../interfaces/Plugin';
import { PluginRegistry } from '../interfaces/PluginRegistry';
export declare class DefaultPluginRegistry implements PluginRegistry {
    private readonly plugins;
    register(plugin: Plugin): Promise<void>;
    unregister(pluginId: string): Promise<void>;
    getPlugin(pluginId: string): Plugin | null;
    getAllPlugins(): Plugin[];
    getSupportedPlugins(capability: string): Plugin[];
}
