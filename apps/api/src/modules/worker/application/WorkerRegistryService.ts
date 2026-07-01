import { Injectable, Logger } from '@nestjs/common';
import { WorkerInfo, WorkerStatus } from '../domain/WorkerTypes';

@Injectable()
export class WorkerRegistryService {
  private readonly logger = new Logger(WorkerRegistryService.name);
  
  // Mocking Redis registry with in-memory map for the runtime prototype
  private workers: Map<string, WorkerInfo> = new Map();

  public registerWorker(workerInfo: WorkerInfo): void {
    this.logger.log(`Registering worker ${workerInfo.id}`);
    this.workers.set(workerInfo.id, {
      ...workerInfo,
      lastHeartbeat: new Date(),
    });
  }

  public recordHeartbeat(workerId: string, metrics: any): void {
    const worker = this.workers.get(workerId);
    if (!worker) {
      this.logger.warn(`Heartbeat received from unknown worker ${workerId}`);
      return;
    }

    worker.lastHeartbeat = new Date();
    worker.metrics = { ...worker.metrics, ...metrics };
    if (worker.status === WorkerStatus.Unhealthy || worker.status === WorkerStatus.Disconnected) {
      worker.status = metrics.runningJobs > 0 ? WorkerStatus.Busy : WorkerStatus.Idle;
    }
  }

  public getActiveWorkersByCapability(capability: string): WorkerInfo[] {
    const now = Date.now();
    const activeWorkers: WorkerInfo[] = [];

    for (const worker of this.workers.values()) {
      const isAlive = now - worker.lastHeartbeat.getTime() < 30000; // 30s threshold
      if (isAlive && worker.capabilities.includes(capability)) {
        activeWorkers.push(worker);
      }
    }
    return activeWorkers;
  }

  public getAllActiveWorkers(): WorkerInfo[] {
    const now = Date.now();
    return Array.from(this.workers.values()).filter(
      w => now - w.lastHeartbeat.getTime() < 30000,
    );
  }

  public async sweepDeadWorkers(): Promise<void> {
    const now = Date.now();
    for (const [id, worker] of this.workers.entries()) {
      if (now - worker.lastHeartbeat.getTime() > 30000) {
        if (worker.status !== WorkerStatus.Dead) {
          this.logger.warn(`Worker ${id} declared Dead. Triggering recovery...`);
          worker.status = WorkerStatus.Dead;
          await this.triggerRecovery(id);
        }
      }
    }
  }

  private async triggerRecovery(workerId: string): Promise<void> {
    // Moves pending jobs to central queue or assigns to new worker
    this.logger.log(`Recovering jobs for dead worker ${workerId}`);
  }
}
