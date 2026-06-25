import { Module, Global } from '@nestjs/common';
import { ITracer, IMetrics, TraceContext, Activity, Metric, MetricType } from '@rrss-auto/observability';

class DummyTracer implements ITracer {
  startActivity(name: string, parentContext?: any): any {
    return { name, end: () => {}, recordException: () => {} };
  }
  currentContext(): any {
    return undefined;
  }
  async trace<T>(name: string, fn: (activity: any) => Promise<T>): Promise<T> {
    return fn({ name, end: () => {}, recordException: () => {} });
  }
}

class DummyMetrics implements IMetrics {
  increment(name: string, amount?: number, labels?: Record<string, string>): void {}
  gauge(name: string, value: number, labels?: Record<string, string>): void {}
  histogram(name: string, value: number, labels?: Record<string, string>): void {}
  async timing<T>(name: string, fn: () => Promise<T>, labels?: Record<string, string>): Promise<T> {
    return fn();
  }
}

@Global()
@Module({
  providers: [
    { provide: 'ITracer', useClass: DummyTracer },
    { provide: 'IMetrics', useClass: DummyMetrics }
  ],
  exports: ['ITracer', 'IMetrics'],
})
export class AppObservabilityModule {}
