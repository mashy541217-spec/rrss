import { Specification } from '@rrss-auto/domain';
import { Worker } from '../aggregates/Worker';

export class WorkerIsAvailableSpecification implements Specification<Worker> {
  public isSatisfiedBy(worker: Worker): boolean {
    return worker.isAvailable && worker.isHealthy;
  }
}
