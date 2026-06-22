import { Schedule } from '../aggregates/Schedule';
import { ScheduleId } from '../value-objects/ScheduleId';

export interface IScheduleRepository {
  save(schedule: Schedule): Promise<void>;
  findById(id: ScheduleId): Promise<Schedule | null>;
  delete(id: ScheduleId): Promise<void>;
  findByWorkspaceRef(workspaceRef: string): Promise<Schedule[]>;
}
