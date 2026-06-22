import { Schedule } from '../../../../../../apps/api/src/modules/scheduler/domain/aggregates/Schedule';
import { ScheduleId } from '../../../../../../apps/api/src/modules/scheduler/domain/value-objects/ScheduleId';
import { IScheduleRepository } from '../../../../../../apps/api/src/modules/scheduler/domain/repositories/IScheduleRepository';

export class FakeScheduleRepository implements IScheduleRepository {
  private items = new Map<string, Schedule>();

  public async save(schedule: Schedule): Promise<void> {
    this.items.set(schedule.id.value, schedule);
  }

  public async findById(id: ScheduleId): Promise<Schedule | null> {
    return this.items.get(id.value) || null;
  }

  public async delete(id: ScheduleId): Promise<void> {
    this.items.delete(id.value);
  }

  public async findByWorkspaceRef(workspaceRef: string): Promise<Schedule[]> {
    return Array.from(this.items.values()).filter(s => s.workspaceRef === workspaceRef);
  }
}
