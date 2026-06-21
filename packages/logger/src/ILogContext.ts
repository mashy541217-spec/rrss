/**
 * Structured contextual metadata attached to log entries.
 *
 * Allows callers to enrich log records with domain-specific
 * key-value pairs (e.g., correlation IDs, module names, user IDs).
 */
export interface ILogContext {
  /** The module, service, or component emitting the log. */
  readonly module?: string;

  /** Correlation ID for distributed tracing. */
  readonly correlationId?: string;

  /** Additional arbitrary context key-value pairs. */
  readonly [key: string]: unknown;
}
