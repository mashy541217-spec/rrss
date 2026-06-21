/**
 * Result of a single health check indicator.
 */
export interface HealthIndicatorResult {
  /** Whether this component is healthy. */
  readonly isHealthy: boolean;

  /** Optional details about the health status. */
  readonly details?: Readonly<Record<string, unknown>>;

  /** Optional error if the health check failed. */
  readonly error?: Error;
}

/**
 * Overall health report aggregating multiple indicators.
 */
export interface HealthReport {
  /** Whether the overall system is healthy. */
  readonly isHealthy: boolean;

  /** ISO-8601 timestamp of when the report was generated. */
  readonly timestamp: string;

  /** Individual indicator results keyed by component name. */
  readonly indicators: Readonly<Record<string, HealthIndicatorResult>>;
}

/**
 * Contract for health checking and reporting.
 *
 * Aggregates the health status of multiple system components
 * (database, cache, message queue, external APIs, etc.)
 * into a unified health report.
 */
export interface IHealthReporter {
  /**
   * Register a named health check indicator.
   *
   * @param name  - Unique name for this health indicator.
   * @param check - Function that performs the health check.
   */
  register(name: string, check: () => Promise<HealthIndicatorResult>): void;

  /**
   * Run all registered health checks and produce a report.
   *
   * @returns A comprehensive {@link HealthReport}.
   */
  report(): Promise<HealthReport>;

  /**
   * Run a single named health check.
   *
   * @param name - The name of the registered indicator.
   * @returns The result for the specified indicator.
   * @throws If no indicator with the given name is registered.
   */
  check(name: string): Promise<HealthIndicatorResult>;
}
