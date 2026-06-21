import { Specification } from '@rrss-auto/domain';
import { Job } from '../aggregates/Job';
import { JobStatus } from '../enums/JobStatus';

export class JobCanBeClaimedSpecification implements Specification<Job> {
  public isSatisfiedBy(job: Job): boolean {
    return job.status === JobStatus.Enqueued;
  }
}
