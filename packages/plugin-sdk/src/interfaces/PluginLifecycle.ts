import { PluginConfiguration } from './PluginConfiguration';
import { PluginContext } from './PluginContext';

export interface PluginLifecycle {
  onInstall?(context: PluginContext): Promise<void>;
  onEnable?(context: PluginContext, config: PluginConfiguration): Promise<void>;
  onDisable?(context: PluginContext): Promise<void>;
  onUpgrade?(context: PluginContext, oldVersion: string, newVersion: string): Promise<void>;
  onRemove?(context: PluginContext): Promise<void>;
}
