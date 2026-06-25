"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPluginLoader = void 0;
class DefaultPluginLoader {
    async load(pluginModuleOrInstance) {
        if (!pluginModuleOrInstance) {
            throw new Error('Plugin module or instance is required');
        }
        let plugin;
        if (typeof pluginModuleOrInstance === 'function') {
            plugin = new pluginModuleOrInstance();
        }
        else {
            plugin = pluginModuleOrInstance;
        }
        if (!plugin.manifest || !plugin.manifest.id || !plugin.executeAction) {
            throw new Error('Invalid plugin format: missing manifest or executeAction method');
        }
        return plugin;
    }
}
exports.DefaultPluginLoader = DefaultPluginLoader;
