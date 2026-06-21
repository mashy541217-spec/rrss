/**
 * Type of metric measurement.
 *
 * - `counter`   – Monotonically increasing value (e.g., request count).
 * - `gauge`     – Value that can go up and down (e.g., active connections).
 * - `histogram` – Distribution of values (e.g., response time).
 */
export type MetricType = 'counter' | 'gauge' | 'histogram';

/**
 * Represents a single metric data point.
 *
 * Used by metrics collectors and exporters to record
 * and transmit measurement data.
 */
export interface Metric {
  /** The name of the metric (e.g., "http.requests.total"). */
  readonly name: string;

  /** The type of this metric. */
  readonly type: MetricType;

  /** The numeric value of this measurement. */
  readonly value: number;

  /** ISO-8601 timestamp of when this measurement was recorded. */
  readonly timestamp: string;

  /** Optional labels/tags for metric dimensions. */
  readonly labels?: Readonly<Record<string, string>>;

  /** Optional unit of measurement (e.g., "ms", "bytes", "requests"). */
  readonly unit?: string;
}
