import { Activity } from './Activity';
import { TraceContext } from './TraceContext';

/**
 * Contract for distributed tracing controllers.
 *
 * Concrete implementations may integrate with OpenTelemetry,
 * AWS X-Ray, Jaeger, Zipkin, or any other tracing backend.
 */
export interface ITracer {
  /**
   * Start a new activity (span) with the given name.
   *
   * @param name       - Descriptive name for the operation being traced.
   * @param parentContext - Optional parent trace context for nesting.
   * @returns A new {@link Activity} that must be ended by the caller.
   */
  startActivity(name: string, parentContext?: TraceContext): Activity;

  /**
   * Retrieve the current trace context, if any.
   *
   * @returns The active {@link TraceContext}, or `undefined` if none is active.
   */
  currentContext(): TraceContext | undefined;

  /**
   * Execute a function within a traced activity scope.
   *
   * Automatically starts and ends the activity, recording
   * success or failure based on the function outcome.
   *
   * @param name - Activity name.
   * @param fn   - The function to execute within the trace.
   * @returns The result of the traced function.
   */
  trace<T>(name: string, fn: (activity: Activity) => Promise<T>): Promise<T>;
}
