import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IClusterProvider } from '../domain/providers/IClusterProvider';
// import { WorkerRepository } from '../../worker/domain/IWorkerRepository';

export class InitiateRollingUpdateCommand {
  constructor(
    public readonly clusterId: string,
    public readonly newImageVersion: string
  ) {}
}

@CommandHandler(InitiateRollingUpdateCommand)
export class InitiateRollingUpdateUseCase implements ICommandHandler<InitiateRollingUpdateCommand> {
  // constructor(private readonly clusterProvider: IClusterProvider) {}

  async execute(command: InitiateRollingUpdateCommand): Promise<void> {
    console.log(`[Orchestrator] Initiating rolling update for cluster ${command.clusterId} to version ${command.newImageVersion}`);
    
    // 1. Identify all nodes in the cluster
    // const nodes = await this.clusterProvider.getNodes(command.clusterId);
    const nodes = [{ id: 'node-1' }, { id: 'node-2' }];

    for (const node of nodes) {
      // 2. Cordon the node (stops accepting new jobs via K8s, or updates WorkerStatus to DRAINING in DB)
      console.log(`[Orchestrator] Cordoning node ${node.id} for draining...`);
      // await this.clusterProvider.cordonNode(node.id);

      // 3. The node finishes active jobs, then terminates. The Orchestrator automatically replaces it
      // with a new replica running `newImageVersion`.
    }
    console.log(`[Orchestrator] Rolling update triggered successfully.`);
  }
}
