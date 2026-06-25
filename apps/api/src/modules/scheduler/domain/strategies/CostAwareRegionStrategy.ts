import { Worker, WorkerStatus } from '../../worker/domain/Worker';
import { CostProfile } from '../../orchestrator/domain/value-objects/CostProfile';

export class CostAwareRegionStrategy {
  /**
   * Selects the best worker considering capabilities, region preference, labels, and cost.
   */
  selectBestWorker(
    availableWorkers: Worker[], 
    requiredPlugins: string[], 
    requiredLabels: Record<string, string>,
    preferredRegion?: string,
    requiredBrowser?: string
  ): Worker | null {
    
    // 1. Filter by status
    let candidates = availableWorkers.filter(w => w.status === WorkerStatus.ONLINE);

    // 2. Filter by Capabilities & Labels
    candidates = candidates.filter(w => {
      const hasCapabilities = w.capabilities.canExecute(requiredPlugins, requiredBrowser);
      const hasLabels = Object.entries(requiredLabels).every(([key, val]) => w.labels[key] === val);
      return hasCapabilities && hasLabels;
    });

    if (candidates.length === 0) return null;

    // 3. Filter by Health
    candidates = candidates.filter(w => w.health?.isHealthy && !w.isStale(30));
    if (candidates.length === 0) return null;

    // 4. Region Preference (If preferred region is given, try to match it first)
    if (preferredRegion) {
      const regionMatch = candidates.filter(w => w.region === preferredRegion);
      if (regionMatch.length > 0) {
        candidates = regionMatch;
      }
    }

    // 5. Cost Optimization (Sort by an assumed cost profile, fallback to load)
    // In reality, cost would be fetched from the Worker or Node entity. We simulate it here.
    candidates.sort((a, b) => {
      // Mocking cost profile check
      const costA = (a as any).costProfile?.estimatedCostPerExecutionUsd || 0;
      const costB = (b as any).costProfile?.estimatedCostPerExecutionUsd || 0;
      
      if (costA !== costB) return costA - costB; // Cheaper first
      
      // Fallback to load score
      return (a.health?.loadScore || 100) - (b.health?.loadScore || 100);
    });

    return candidates[0];
  }
}
