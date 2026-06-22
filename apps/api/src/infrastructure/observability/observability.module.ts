import { Module, Global } from '@nestjs/common';
import { ITracer, IMetrics, TraceContext, Activity, Metric, MetricType } from '@rrss-auto/observability';

class DummyTracer implements ITracer {
  startTrace(name: string, attributes?: Record<string, any>): TraceContext {
    return new TraceContext(`trace-${Date.now()}`, `span-${Date.now()}`);
  }
  startActivity(name: string, context?: TraceContext): Activity {
    return new Activity(name, context || this.startTrace(name));
  }
}

class DummyMetrics implements IMetrics {
  record(metric: Metric): void {}
  incrementCounter(name: string, value?: number, tags?: Record<string, string>): void {}
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void {}
  recordGauge(name: string, value: number, tags?: Record<string, string>): void {}
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
