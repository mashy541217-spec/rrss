/**
 * @deprecated Import directly from '@rrss-auto/observability' instead.
 * Re-exported here for backward compatibility only.
 */
export {
  HealthIndicatorResult,
  HealthReport,
  IHealthReporter,
  TraceContext,
  Activity,
  Metric,
  MetricType,
  IMetrics,
  ITracer,
} from '@rrss-auto/observability';

/**
 * Backward-compatible alias.
 * @deprecated Use {@link IHealthReporter} from '@rrss-auto/observability' instead.
 */
import { HealthIndicatorResult as HIR } from '@rrss-auto/observability';
export interface IHealthCheck {
  check(): Promise<HIR>;
  name: string;
}
