import { Worker } from '../aggregates/Worker';
import { WorkerId } from '../value-objects/WorkerId';

export interface IWorkerRepository {
  save(worker: Worker): Promise<void>;
  findById(id: WorkerId): Promise<Worker | null>;
  delete(id: WorkerId): Promise<void>;
}
