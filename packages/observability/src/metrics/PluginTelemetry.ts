import { IMetricsProvider } from './IMetricsProvider';

export class PluginTelemetry {
  constructor(private metrics: IMetricsProvider) {}

  recordLatency(pluginId: string, operation: string, durationMs: number, status: 'success' | 'error') {
    this.metrics.recordHistogram('plugin.execution.latency', durationMs, { pluginId, operation, status });
  }

  recordError(pluginId: string, errorType: string) {
    this.metrics.incrementCounter('plugin.execution.errors', 1, { pluginId, errorType });
  }

  recordRateLimitHit(pluginId: string) {
    this.metrics.incrementCounter('plugin.rate_limit.hits', 1, { pluginId });
  }
}
