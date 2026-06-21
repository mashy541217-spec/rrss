/**
 * Represents the context of a distributed trace.
 *
 * Carries correlation identifiers across service boundaries,
 * enabling end-to-end request tracking in distributed systems.
 *
 * Compatible with W3C Trace Context propagation format.
 */
export interface TraceContext {
  /** Unique identifier for the entire trace/request. */
  readonly traceId: string;

  /** Unique identifier for this specific span within the trace. */
  readonly spanId: string;

  /** Identifier of the parent span, if any. */
  readonly parentSpanId?: string;

  /** Sampling flag – `true` if this trace is being recorded. */
  readonly isSampled: boolean;

  /**
   * Optional baggage items propagated across service boundaries.
   * Useful for passing contextual data (e.g., tenant ID, user ID).
   */
  readonly baggage?: Readonly<Record<string, string>>;
}
