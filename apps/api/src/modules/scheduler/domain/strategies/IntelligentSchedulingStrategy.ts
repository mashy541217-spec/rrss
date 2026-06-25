import { Worker, WorkerStatus } from '../../worker/domain/Worker';

export class IntelligentSchedulingStrategy {
  
  /**
   * Selects the best worker for a given job based on capabilities and load.
   */
  selectBestWorker(
    availableWorkers: Worker[], 
    requiredPlugins: string[], 
    requiredBrowser?: string
  ): Worker | null {
    
    // 1. Filter by status (ONLINE only)
    let candidates = availableWorkers.filter(w => w.status === WorkerStatus.ONLINE);

    // 2. Filter by Capabilities
    candidates = candidates.filter(w => w.capabilities.canExecute(requiredPlugins, requiredBrowser));

    if (candidates.length === 0) {
      return null; // No capable workers available
    }

    // 3. Filter by Health (Must be healthy and have recent heartbeat)
    candidates = candidates.filter(w => w.health?.isHealthy && !w.isStale(30));

    if (candidates.length === 0) {
      return null;
    }

    // 4. Sort by Load Score (lowest load first)
    candidates.sort((a, b) => {
      const loadA = a.health?.loadScore || 100;
      const loadB = b.health?.loadScore || 100;
      return loadA - loadB;
    });

    // Return the least loaded capable worker
    return candidates[0];
  }
}
