import { IRepository } from '@rrss-auto/domain';
import { Job } from '../aggregates/Job';
import { JobId } from '../value-objects/JobId';
import { JobStatus } from '../enums/JobStatus';

export interface IJobRepository extends IRepository<Job, JobId> {
  save(job: Job): Promise<void>;
  findById(id: JobId): Promise<Job | null>;
  delete(id: JobId): Promise<void>;
  findByExecutionId(executionId: string): Promise<Job[]>;
  findByStatus(status: JobStatus, workspaceRef?: string): Promise<Job[]>;
  findClaimableByQueue(queue: string, limit?: number): Promise<Job[]>;
}
