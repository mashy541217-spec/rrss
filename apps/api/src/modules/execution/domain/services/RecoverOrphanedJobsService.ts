import { Worker } from '../../worker/domain/Worker';

export interface IExecutionRepository {
  findActiveExecutionsByWorkerId(workerId: string): Promise<any[]>;
  requeueExecution(executionId: string): Promise<void>;
}

export class RecoverOrphanedJobsService {
  constructor(
    private readonly executionRepository: IExecutionRepository
    // private readonly workerRepository: IWorkerRepository
  ) {}

  /**
   * Intended to be run via a CronJob (e.g. every 30 seconds)
   * Scans for workers that haven't sent a heartbeat within the threshold.
   */
  async recoverJobs(staleWorkers: Worker[]) {
    for (const worker of staleWorkers) {
      console.log(`[FaultTolerance] Worker ${worker.id} is stale. Initiating recovery...`);
      
      // 1. Mark worker offline
      worker.markOffline();
      // await this.workerRepository.save(worker);

      // 2. Find any executions currently assigned to this dead worker
      const orphanedExecutions = await this.executionRepository.findActiveExecutionsByWorkerId(worker.id);

      // 3. Requeue them into the RetryQueue
      for (const exec of orphanedExecutions) {
        console.log(`[FaultTolerance] Requeuing orphaned execution ${exec.id}`);
        await this.executionRepository.requeueExecution(exec.id);
      }
    }
  }
}
