/**
 * Represents a unit of work within a distributed trace (span).
 *
 * An Activity tracks the duration and outcome of an operation.
 * Concrete implementations may map to OpenTelemetry Spans,
 * AWS X-Ray segments, or any other tracing backend.
 */
export interface Activity {
  /** The name/label of this activity. */
  readonly name: string;

  /** ISO-8601 timestamp of when this activity started. */
  readonly startTime: string;

  /**
   * Attach a key-value attribute to this activity.
   *
   * @param key - Attribute name.
   * @param value - Attribute value.
   */
  setAttribute(key: string, value: string | number | boolean): void;

  /**
   * Record an event/log within this activity's timeline.
   *
   * @param name - Event name.
   * @param attributes - Optional event attributes.
   */
  addEvent(name: string, attributes?: Record<string, string | number | boolean>): void;

  /**
   * Mark this activity as having completed successfully.
   */
  setSuccess(): void;

  /**
   * Mark this activity as having failed with an error.
   *
   * @param error - The error that caused the failure.
   */
  setError(error: Error): void;

  /**
   * End this activity, recording its duration.
   * Must be called exactly once, after setSuccess() or setError().
   */
  end(): void;
}
