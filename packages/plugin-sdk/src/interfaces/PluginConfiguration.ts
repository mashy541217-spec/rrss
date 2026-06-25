export interface PluginConfiguration {
  readonly settings: Record<string, any>;
  readonly credentials?: Record<string, any>;
}
