import { Job } from '../../../../../../apps/api/src/modules/execution/domain/aggregates/Job';
import { JobId } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/JobId';
import { JobStatus } from '../../../../../../apps/api/src/modules/execution/domain/enums/JobStatus';
import { IJobRepository } from '../../../../../../apps/api/src/modules/execution/domain/repositories/IJobRepository';


export class FakeJobRepository implements IJobRepository {
  private readonly items = new Map<string, Job>();

  public async save(job: Job): Promise<void> {
    this.items.set(job.id.value, job);
  }

  public async findById(id: JobId): Promise<Job | null> {
    return this.items.get(id.value) || null;
  }

  public async delete(id: JobId): Promise<void> {
    this.items.delete(id.value);
  }

  public async findByExecutionId(executionId: string): Promise<Job[]> {
    const all = Array.from(this.items.values());
    return all.filter((j) => j.executionId === executionId);
  }

  public async findByStatus(status: JobStatus, workspaceRef?: string): Promise<Job[]> {
    const all = Array.from(this.items.values());
    let filtered = all.filter((j) => j.status === status);
    if (workspaceRef) {
      filtered = filtered.filter((j) => j.workspaceRef === workspaceRef);
    }
    return filtered;
  }

  public async findClaimableByQueue(queue: string, limit: number = 10): Promise<Job[]> {
    const all = Array.from(this.items.values());
    return all
      .filter((j) => j.status === JobStatus.Enqueued && j.queue === queue)
      .slice(0, limit);
  }
}
