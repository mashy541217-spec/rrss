import { Plugin } from '../interfaces/Plugin';
import { PluginRegistry } from '../interfaces/PluginRegistry';

export class DefaultPluginRegistry implements PluginRegistry {
  private readonly plugins: Map<string, Plugin> = new Map();

  public async register(plugin: Plugin): Promise<void> {
    const id = plugin.manifest.id;
    if (this.plugins.has(id)) {
      throw new Error(`Plugin with ID ${id} is already registered`);
    }
    this.plugins.set(id, plugin);
  }

  public async unregister(pluginId: string): Promise<void> {
    if (!this.plugins.has(pluginId)) {
      throw new Error(`Plugin with ID ${pluginId} is not registered`);
    }
    this.plugins.delete(pluginId);
  }

  public getPlugin(pluginId: string): Plugin | null {
    return this.plugins.get(pluginId) || null;
  }

  public getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  public getSupportedPlugins(capability: string): Plugin[] {
    return this.getAllPlugins().filter(p =>
      p.manifest.capabilities.includes(capability as any)
    );
  }
}
