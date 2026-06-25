import { TraceContext } from '../tracing/TraceContext';

export interface ILogger {
  debug(message: string, context?: TraceContext, attributes?: Record<string, any>): void;
  info(message: string, context?: TraceContext, attributes?: Record<string, any>): void;
  warn(message: string, context?: TraceContext, attributes?: Record<string, any>): void;
  error(message: string, error?: Error, context?: TraceContext, attributes?: Record<string, any>): void;
  fatal(message: string, error?: Error, context?: TraceContext, attributes?: Record<string, any>): void;
}
