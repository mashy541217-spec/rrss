import { IRepository } from '@rrss-auto/domain';
import { Worker } from '../aggregates/Worker';
import { WorkerId } from '../value-objects/WorkerId';
import { CapabilityType } from '../enums/CapabilityType';
import { WorkerStatus } from '../enums/WorkerStatus';

export interface IWorkerRepository extends IRepository<Worker, WorkerId> {
  save(worker: Worker): Promise<void>;
  findById(id: WorkerId): Promise<Worker | null>;
  delete(id: WorkerId): Promise<void>;
  findAvailableByCapability(type: CapabilityType): Promise<Worker[]>;
  findByStatus(status: WorkerStatus): Promise<Worker[]>;
  findByHostname(hostname: string): Promise<Worker | null>;
}
