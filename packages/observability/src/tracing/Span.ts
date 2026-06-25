import { TraceContext } from './TraceContext';

export interface Span {
  context: TraceContext;
  operationName: string;
  startTime: number;
  endTime?: number;
  attributes: Record<string, any>;
  status: 'OK' | 'ERROR' | 'UNSET';
  
  end(status?: 'OK' | 'ERROR'): void;
  setAttribute(key: string, value: any): void;
}
