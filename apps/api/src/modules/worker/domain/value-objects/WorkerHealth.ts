export class WorkerHealth {
  constructor(
    public readonly cpuUsagePercent: number,
    public readonly ramUsageMb: number,
    public readonly totalRamMb: number,
    public readonly activeJobs: number,
    public readonly browserSessions: number,
    public readonly networkLatencyMs: number,
    public readonly isHealthy: boolean,
    public readonly temperatureCelsius?: number
  ) {}

  get loadScore(): number {
    // 0 to 100 where higher is heavier load
    const cpuWeight = 0.4;
    const ramWeight = 0.4;
    const jobsWeight = 0.2;
    
    const ramPercent = (this.ramUsageMb / this.totalRamMb) * 100;
    // Assume max 10 jobs per worker for scoring purposes
    const jobsPercent = Math.min((this.activeJobs / 10) * 100, 100);

    return (this.cpuUsagePercent * cpuWeight) + (ramPercent * ramWeight) + (jobsPercent * jobsWeight);
  }
}
