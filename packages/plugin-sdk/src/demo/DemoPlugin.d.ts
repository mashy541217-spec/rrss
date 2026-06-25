import { Plugin } from '../interfaces/Plugin';
import { PluginManifest } from '../interfaces/PluginManifest';
import { PluginConfiguration } from '../interfaces/PluginConfiguration';
import { PluginContext } from '../interfaces/PluginContext';
import { PluginHealth } from '../interfaces/PluginHealth';
export declare class DemoPlugin implements Plugin {
    readonly manifest: PluginManifest;
    private isEnabled;
    onInstall(context: PluginContext): Promise<void>;
    onEnable(context: PluginContext, config: PluginConfiguration): Promise<void>;
    onDisable(context: PluginContext): Promise<void>;
    onUpgrade(context: PluginContext, oldVersion: string, newVersion: string): Promise<void>;
    onRemove(context: PluginContext): Promise<void>;
    executeAction(actionName: string, context: PluginContext, config: PluginConfiguration, params: Record<string, any>): Promise<any>;
    checkHealth(context: PluginContext, config: PluginConfiguration): Promise<PluginHealth>;
}
