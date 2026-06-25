"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPluginRegistry = void 0;
class DefaultPluginRegistry {
    plugins = new Map();
    async register(plugin) {
        const id = plugin.manifest.id;
        if (this.plugins.has(id)) {
            throw new Error(`Plugin with ID ${id} is already registered`);
        }
        this.plugins.set(id, plugin);
    }
    async unregister(pluginId) {
        if (!this.plugins.has(pluginId)) {
            throw new Error(`Plugin with ID ${pluginId} is not registered`);
        }
        this.plugins.delete(pluginId);
    }
    getPlugin(pluginId) {
        return this.plugins.get(pluginId) || null;
    }
    getAllPlugins() {
        return Array.from(this.plugins.values());
    }
    getSupportedPlugins(capability) {
        return this.getAllPlugins().filter(p => p.manifest.capabilities.includes(capability));
    }
}
exports.DefaultPluginRegistry = DefaultPluginRegistry;
