import { ScalingPolicy } from '../value-objects/ScalingPolicy';

export enum ClusterStatus {
  HEALTHY = 'HEALTHY',
  SCALING = 'SCALING',
  DEGRADED = 'DEGRADED',
  MAINTENANCE = 'MAINTENANCE'
}

export class Cluster {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly region: string,
    public readonly labels: Record<string, string>,
    public status: ClusterStatus,
    public readonly scalingPolicy: ScalingPolicy,
    public currentWorkers: number
  ) {}

  requiresScaleUp(queueLength: number): boolean {
    return (
      queueLength >= this.scalingPolicy.scaleUpQueueThreshold && 
      this.currentWorkers < this.scalingPolicy.maxWorkers
    );
  }

  requiresScaleDown(queueLength: number): boolean {
    return (
      queueLength <= this.scalingPolicy.scaleDownQueueThreshold && 
      this.currentWorkers > this.scalingPolicy.minWorkers
    );
  }
}
