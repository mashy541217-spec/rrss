import { Scheduler } from '../aggregates/Scheduler';
import { SchedulerId } from '../value-objects/SchedulerId';

export interface ISchedulerRepository {
  save(scheduler: Scheduler): Promise<void>;
  findById(id: SchedulerId): Promise<Scheduler | null>;
  delete(id: SchedulerId): Promise<void>;
}
