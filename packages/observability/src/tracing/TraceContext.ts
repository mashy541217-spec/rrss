export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  executionId: string;
  correlationId?: string;
  workerId?: string;
  pluginId?: string;
  workspaceId: string;
  organizationId: string;
}
