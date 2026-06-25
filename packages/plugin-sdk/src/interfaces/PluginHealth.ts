export interface PluginHealth {
  readonly isHealthy: boolean;
  readonly lastCheckedAt: Date;
  readonly message?: string;
}
