import { Span } from '../tracing/Span';

export interface WorkflowTimeline {
  executionId: string;
  rootSpan: Span;
  childSpans: Span[];
  events: any[]; // Abstracted Event Store link
}

export interface IReplayManager {
  /**
   * Reconstructs the exact timeline of a workflow execution from the tracing backend and event store.
   * This is the architectural foundation for building a visual workflow replayer in the Automation Studio.
   */
  getExecutionTimeline(executionId: string): Promise<WorkflowTimeline>;
}
