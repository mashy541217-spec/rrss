import { Scheduler } from '../../../../../../apps/api/src/modules/scheduler/domain/aggregates/Scheduler';
import { SchedulerId } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/SchedulerId';
import { ISchedulerRepository } from '../../../../../../apps/api/src/modules/scheduler/domain/repositories/ISchedulerRepository';

export class FakeSchedulerRepository implements ISchedulerRepository {
  private items = new Map<string, Scheduler>();

  public async save(scheduler: Scheduler): Promise<void> {
    this.items.set(scheduler.id.value, scheduler);
  }

  public async findById(id: SchedulerId): Promise<Scheduler | null> {
    return this.items.get(id.value) || null;
  }

  public async delete(id: SchedulerId): Promise<void> {
    this.items.delete(id.value);
  }
}
