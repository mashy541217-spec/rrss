/**
 * Contract for collecting application metrics.
 *
 * Concrete implementations may forward metrics to
 * Prometheus, StatsD, CloudWatch, Datadog, etc.
 */
export interface IMetrics {
  /**
   * Increment a counter metric by a given amount.
   *
   * @param name   - Metric name (e.g., "orders.created").
   * @param amount - Increment value (defaults to 1).
   * @param labels - Optional dimensional labels.
   */
  increment(name: string, amount?: number, labels?: Record<string, string>): void;

  /**
   * Set the current value of a gauge metric.
   *
   * @param name   - Metric name (e.g., "connections.active").
   * @param value  - Current gauge value.
   * @param labels - Optional dimensional labels.
   */
  gauge(name: string, value: number, labels?: Record<string, string>): void;

  /**
   * Record a value in a histogram metric.
   *
   * @param name   - Metric name (e.g., "http.response_time_ms").
   * @param value  - The observed value.
   * @param labels - Optional dimensional labels.
   */
  histogram(name: string, value: number, labels?: Record<string, string>): void;

  /**
   * Measure the duration of an asynchronous operation
   * and record it as a histogram metric.
   *
   * @param name   - Metric name for the duration histogram.
   * @param fn     - The async function to measure.
   * @param labels - Optional dimensional labels.
   * @returns The result of the measured function.
   */
  timing<T>(name: string, fn: () => Promise<T>, labels?: Record<string, string>): Promise<T>;
}
