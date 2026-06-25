import { PluginManifest } from './PluginManifest';
import { PluginConfiguration } from './PluginConfiguration';
export interface PluginInstaller {
    install(manifest: PluginManifest, config: PluginConfiguration): Promise<void>;
    uninstall(pluginId: string): Promise<void>;
}
