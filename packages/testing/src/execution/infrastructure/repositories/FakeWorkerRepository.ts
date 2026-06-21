import { Worker } from '../../../../../../apps/api/src/modules/execution/domain/aggregates/Worker';
import { WorkerId } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/WorkerId';
import { CapabilityType } from '../../../../../../apps/api/src/modules/execution/domain/enums/CapabilityType';
import { WorkerStatus } from '../../../../../../apps/api/src/modules/execution/domain/enums/WorkerStatus';
import { IWorkerRepository } from '../../../../../../apps/api/src/modules/execution/domain/repositories/IWorkerRepository';


export class FakeWorkerRepository implements IWorkerRepository {
  private readonly items = new Map<string, Worker>();

  public async save(worker: Worker): Promise<void> {
    this.items.set(worker.id.value, worker);
  }

  public async findById(id: WorkerId): Promise<Worker | null> {
    return this.items.get(id.value) || null;
  }

  public async delete(id: WorkerId): Promise<void> {
    this.items.delete(id.value);
  }

  public async findAvailableByCapability(type: CapabilityType): Promise<Worker[]> {
    const all = Array.from(this.items.values());
    return all.filter((w) => w.isAvailable && w.isHealthy && w.supportsCapability(type));
  }

  public async findByStatus(status: WorkerStatus): Promise<Worker[]> {
    const all = Array.from(this.items.values());
    return all.filter((w) => w.status === status);
  }

  public async findByHostname(hostname: string): Promise<Worker | null> {
    const all = Array.from(this.items.values());
    return all.find((w) => w.hostname === hostname) || null;
  }
}
