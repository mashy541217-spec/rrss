import { PluginManifest } from './PluginManifest';
import { PluginConfiguration } from './PluginConfiguration';
import { PluginContext } from './PluginContext';
import { PluginLifecycle } from './PluginLifecycle';
import { PluginHealth } from './PluginHealth';
export interface Plugin extends PluginLifecycle {
    readonly manifest: PluginManifest;
    executeAction(actionName: string, context: PluginContext, config: PluginConfiguration, params: Record<string, any>): Promise<any>;
    checkHealth?(context: PluginContext, config: PluginConfiguration): Promise<PluginHealth>;
}
