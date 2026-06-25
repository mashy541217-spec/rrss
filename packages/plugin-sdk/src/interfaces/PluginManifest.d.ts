import { PluginCapability } from './PluginCapability';
import { PluginMetadata } from './PluginMetadata';
export interface PluginManifest {
    readonly id: string;
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly capabilities: PluginCapability[];
    readonly metadata: PluginMetadata;
    readonly settingsSchema?: Record<string, any>;
}
