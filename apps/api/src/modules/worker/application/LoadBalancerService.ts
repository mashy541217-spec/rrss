import { Injectable, Logger } from '@nestjs/common';
import { WorkerRegistryService } from './WorkerRegistryService';
import { WorkerInfo } from '../domain/WorkerTypes';

export enum LoadBalancerStrategy {
  RoundRobin = 'RoundRobin',
  LeastBusy = 'LeastBusy',
  CapabilityBased = 'CapabilityBased',
}

@Injectable()
export class LoadBalancerService {
  private readonly logger = new Logger(LoadBalancerService.name);
  private roundRobinIndices: Record<string, number> = {};

  constructor(private readonly registry: WorkerRegistryService) {}

  public assignJob(jobType: string, requiredCapability: string, strategy: LoadBalancerStrategy = LoadBalancerStrategy.LeastBusy): WorkerInfo | null {
    const availableWorkers = this.registry.getActiveWorkersByCapability(requiredCapability);
    
    if (availableWorkers.length === 0) {
      this.logger.warn(`No workers available for capability: ${requiredCapability}`);
      return null;
    }

    switch (strategy) {
      case LoadBalancerStrategy.LeastBusy:
        return this.getLeastBusyWorker(availableWorkers);
      case LoadBalancerStrategy.RoundRobin:
        return this.getRoundRobinWorker(requiredCapability, availableWorkers);
      case LoadBalancerStrategy.CapabilityBased:
        // Basic match already done, return first
        return availableWorkers[0];
      default:
        return availableWorkers[0];
    }
  }

  private getLeastBusyWorker(workers: WorkerInfo[]): WorkerInfo {
    return workers.reduce((prev, curr) => {
      // Prioritize smaller queue, then fewer running jobs
      if (curr.metrics.queueLength < prev.metrics.queueLength) return curr;
      if (curr.metrics.queueLength === prev.metrics.queueLength && curr.metrics.runningJobs < prev.metrics.runningJobs) return curr;
      return prev;
    });
  }

  private getRoundRobinWorker(capability: string, workers: WorkerInfo[]): WorkerInfo {
    if (this.roundRobinIndices[capability] === undefined) {
      this.roundRobinIndices[capability] = 0;
    }
    const idx = this.roundRobinIndices[capability] % workers.length;
    this.roundRobinIndices[capability]++;
    return workers[idx];
  }
}
