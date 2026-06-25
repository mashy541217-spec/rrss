import { TraceContext } from '../tracing/TraceContext';

export interface LogEntry {
  timestamp: Date;
  severity: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  context?: TraceContext;
  attributes?: Record<string, any>;
  error?: Error;
}
