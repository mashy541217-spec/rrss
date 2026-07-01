export enum WorkerStatus {
  Starting = 'Starting',
  Idle = 'Idle',
  Busy = 'Busy',
  Publishing = 'Publishing',
  Waiting = 'Waiting',
  Unhealthy = 'Unhealthy',
  Disconnected = 'Disconnected',
  Recovering = 'Recovering',
  Dead = 'Dead',
}

export interface WorkerInfo {
  id: string;
  version: string;
  status: WorkerStatus;
  capabilities: string[];
  tags: string[];
  labels: Record<string, string>;
  lastHeartbeat: Date;
  metrics: {
    cpu: number;
    ram: number;
    runningJobs: number;
    queueLength: number;
    latency: number;
  };
}
