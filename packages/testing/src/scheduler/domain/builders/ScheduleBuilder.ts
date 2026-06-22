import { Schedule } from '../../../../../../apps/api/src/modules/scheduler/domain/aggregates/Schedule';
import { ScheduleId } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/ScheduleId';
import { ScheduleStatus } from '../../../../../../apps/api/src/modules/scheduler/domain/enums/ScheduleStatus';
import { SchedulingPolicy } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/SchedulingPolicy';
import { PriorityPolicy } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/PriorityPolicy';
import { DispatchPriority } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/DispatchPriority';

export class ScheduleBuilder {
  private id: string = 'sched-123';
  private workspaceRef: string = 'wksp-123';
  private status: ScheduleStatus = ScheduleStatus.Active;
  private schedulingPolicy: SchedulingPolicy = SchedulingPolicy.createImmediate();
  private priorityPolicy: PriorityPolicy = PriorityPolicy.create(DispatchPriority.NORMAL);

  public static create(): ScheduleBuilder { return new ScheduleBuilder(); }

  public withId(id: string): this { this.id = id; return this; }
  public withWorkspaceRef(ref: string): this { this.workspaceRef = ref; return this; }
  public withStatus(status: ScheduleStatus): this { this.status = status; return this; }
  public withSchedulingPolicy(policy: SchedulingPolicy): this { this.schedulingPolicy = policy; return this; }
  public withPriorityPolicy(policy: PriorityPolicy): this { this.priorityPolicy = policy; return this; }

  public build(): Schedule {
    const sched = Schedule.create({
      workspaceRef: this.workspaceRef,
      schedulingPolicy: this.schedulingPolicy,
      priorityPolicy: this.priorityPolicy,
    }, ScheduleId.create(this.id));

    if (this.status === ScheduleStatus.Paused) sched.pause();
    else if (this.status === ScheduleStatus.Cancelled) sched.cancel();
    else if (this.status === ScheduleStatus.Completed) sched.complete();

    return sched;
  }
}
