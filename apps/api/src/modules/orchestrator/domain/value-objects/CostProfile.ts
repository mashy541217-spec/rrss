export class CostProfile {
  constructor(
    public readonly estimatedCostPerExecutionUsd: number,
    public readonly currency: string = 'USD'
  ) {}
}
