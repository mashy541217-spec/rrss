import { IWorkerRepository, Worker, WorkerId } from '../../../../../../apps/api/src/modules/worker/domain';

export class FakeWorkerRepository implements IWorkerRepository {
  public workers = new Map<string, Worker>();

  public async save(worker: Worker): Promise<void> {
    this.workers.set(worker.id.value, worker);
  }

  public async findById(id: WorkerId): Promise<Worker | null> {
    return this.workers.get(id.value) || null;
  }

  public async delete(id: WorkerId): Promise<void> {
    this.workers.delete(id.value);
  }
}
