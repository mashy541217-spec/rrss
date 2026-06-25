export class ScalingPolicy {
  constructor(
    public readonly minWorkers: number,
    public readonly maxWorkers: number,
    public readonly scaleUpQueueThreshold: number,
    public readonly scaleDownQueueThreshold: number,
    public readonly cooldownMs: number
  ) {
    if (minWorkers > maxWorkers) throw new Error('minWorkers cannot be greater than maxWorkers');
  }
}
