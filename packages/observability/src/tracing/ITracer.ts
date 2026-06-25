import { Span } from './Span';
import { TraceContext } from './TraceContext';

export interface ITracer {
  startSpan(operationName: string, parentContext?: TraceContext): Span;
  inject(context: TraceContext, carrier: any): void;
  extract(carrier: any): TraceContext | null;
}
