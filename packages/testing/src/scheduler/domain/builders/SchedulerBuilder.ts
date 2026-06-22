import { Scheduler } from '../../../../../../apps/api/src/modules/scheduler/domain/aggregates/Scheduler';
import { SchedulerId } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/SchedulerId';
import { SchedulerStatus } from '../../../../../../apps/api/src/modules/scheduler/domain/enums/SchedulerStatus';
import { ConcurrencyPolicy } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/ConcurrencyPolicy';
import { ConcurrencyLimit } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/ConcurrencyLimit';
import { WorkerSelectionPolicy } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/WorkerSelectionPolicy';
import { WorkerSelectionStrategy } from '../../../../../../apps/api/src/modules/scheduler/domain/enums/WorkerSelectionStrategy';
import { PriorityPolicy } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/PriorityPolicy';
import { DispatchPriority } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/DispatchPriority';
import { RetrySchedulingPolicy } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/RetrySchedulingPolicy';
import { RetryBackoff } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/RetryBackoff';

export class SchedulerBuilder {
  private id: string = 'scheduler-global-1';
  private status: SchedulerStatus = SchedulerStatus.Active;
  private concurrencyPolicy: ConcurrencyPolicy = ConcurrencyPolicy.create(ConcurrencyLimit.create(100));
  private workerSelectionPolicy: WorkerSelectionPolicy = WorkerSelectionPolicy.create({ strategy: WorkerSelectionStrategy.RoundRobin });
  private priorityPolicy: PriorityPolicy = PriorityPolicy.create(DispatchPriority.NORMAL);
  private retryPolicy: RetrySchedulingPolicy = RetrySchedulingPolicy.create(3, RetryBackoff.DEFAULT);

  public static create(): SchedulerBuilder { return new SchedulerBuilder(); }

  public withId(id: string): this { this.id = id; return this; }
  public withStatus(status: SchedulerStatus): this { this.status = status; return this; }
  public withConcurrencyLimit(limit: number): this { 
    this.concurrencyPolicy = ConcurrencyPolicy.create(ConcurrencyLimit.create(limit)); 
    return this; 
  }

  public build(): Scheduler {
    const scheduler = Scheduler.initialize({
      concurrencyPolicy: this.concurrencyPolicy,
      workerSelectionPolicy: this.workerSelectionPolicy,
      priorityPolicy: this.priorityPolicy,
      retryPolicy: this.retryPolicy,
    }, SchedulerId.create(this.id));

    if (this.status === SchedulerStatus.Paused) scheduler.pause();
    else if (this.status === SchedulerStatus.Draining) scheduler.drain();

    return scheduler;
  }
}
