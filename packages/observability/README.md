# @rrss-auto/observability

Shared Observability SDK for **RRSS AUTO**.

## Purpose

Provides framework-agnostic, pure TypeScript abstractions for distributed tracing, metrics collection, and health reporting. No external dependencies (OpenTelemetry, Prometheus, Datadog, etc.). Concrete implementations will be provided by infrastructure adapters.

## Exports

| Export             | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `TraceContext`     | Value object representing distributed trace context      |
| `Activity`         | Interface for a tracing span / activity unit             |
| `Metric`           | Data structure for a single metric measurement           |
| `IMetrics`         | Contract for metrics collection                          |
| `ITracer`          | Contract for distributed tracing                         |
| `IHealthReporter`  | Contract for health checking and reporting               |

## Usage

```typescript
import { ITracer, IMetrics, IHealthReporter } from '@rrss-auto/observability';

class OrderService {
  constructor(
    private readonly tracer: ITracer,
    private readonly metrics: IMetrics,
  ) {}

  async processOrder(orderId: string): Promise<void> {
    const activity = this.tracer.startActivity('process-order');
    try {
      // business logic
      this.metrics.increment('orders.processed');
      activity.setSuccess();
    } catch (error) {
      activity.setError(error as Error);
      throw error;
    } finally {
      activity.end();
    }
  }
}
```
