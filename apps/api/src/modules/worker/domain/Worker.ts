import { WorkerHealth } from './value-objects/WorkerHealth';
import { WorkerCapabilities } from './value-objects/WorkerCapabilities';

export enum WorkerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DRAINING = 'DRAINING', // Finishing current jobs, not accepting new ones
  MAINTENANCE = 'MAINTENANCE'
}

export class Worker {
  constructor(
    public readonly id: string,
    public readonly hostname: string,
    public readonly version: string,
    public status: WorkerStatus,
    public readonly capabilities: WorkerCapabilities,
    public readonly labels: Record<string, string>,
    public readonly region: string,
    public health: WorkerHealth | null,
    public lastHeartbeatAt: Date,
    public readonly registeredAt: Date
  ) {}

  updateHeartbeat(health: WorkerHealth) {
    this.health = health;
    this.lastHeartbeatAt = new Date();
    if (this.status === WorkerStatus.OFFLINE) {
      this.status = WorkerStatus.ONLINE;
    }
  }

  markOffline() {
    this.status = WorkerStatus.OFFLINE;
  }

  isStale(timeoutSeconds: number): boolean {
    const now = new Date();
    const diffSeconds = (now.getTime() - this.lastHeartbeatAt.getTime()) / 1000;
    return diffSeconds > timeoutSeconds;
  }
}
