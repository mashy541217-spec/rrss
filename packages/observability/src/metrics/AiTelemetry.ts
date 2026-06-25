import { IMetricsProvider } from './IMetricsProvider';

export class AiTelemetry {
  constructor(private metrics: IMetricsProvider) {}

  recordUsage(providerId: string, model: string, promptTokens: number, completionTokens: number, estimatedCostUsd: number) {
    this.metrics.incrementCounter('ai.tokens.prompt', promptTokens, { providerId, model });
    this.metrics.incrementCounter('ai.tokens.completion', completionTokens, { providerId, model });
    this.metrics.incrementCounter('ai.cost.estimated', estimatedCostUsd, { providerId, model });
  }

  recordLatency(providerId: string, model: string, durationMs: number) {
    this.metrics.recordHistogram('ai.execution.latency', durationMs, { providerId, model });
  }
}
