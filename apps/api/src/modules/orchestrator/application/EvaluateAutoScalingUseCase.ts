import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IClusterProvider } from '../domain/providers/IClusterProvider';
import { Cluster } from '../domain/entities/Cluster';

export class EvaluateAutoScalingCommand {
  constructor(
    public readonly clusterId: string,
    public readonly currentQueueLength: number
  ) {}
}

@CommandHandler(EvaluateAutoScalingCommand)
export class EvaluateAutoScalingUseCase implements ICommandHandler<EvaluateAutoScalingCommand> {
  // constructor(
  //   private readonly clusterProvider: IClusterProvider,
  //   private readonly clusterRepository: IClusterRepository
  // ) {}

  async execute(command: EvaluateAutoScalingCommand): Promise<void> {
    // const cluster = await this.clusterRepository.findById(command.clusterId);
    // if (!cluster) throw new Error('Cluster not found');

    const cluster = new Cluster(command.clusterId, 'test-cluster', 'us-east-1', {}, 'HEALTHY' as any, { minWorkers: 1, maxWorkers: 10, scaleUpQueueThreshold: 50, scaleDownQueueThreshold: 10, cooldownMs: 60000 } as any, 5); // Mock

    if (cluster.requiresScaleUp(command.currentQueueLength)) {
      console.log(`[AutoScaler] Queue length (${command.currentQueueLength}) exceeds threshold. Scaling UP cluster ${cluster.id}.`);
      // await this.clusterProvider.scaleDeployment(cluster.id, cluster.currentWorkers + 1);
    } else if (cluster.requiresScaleDown(command.currentQueueLength)) {
      console.log(`[AutoScaler] Queue length (${command.currentQueueLength}) below threshold. Scaling DOWN cluster ${cluster.id}.`);
      // await this.clusterProvider.scaleDeployment(cluster.id, cluster.currentWorkers - 1);
    }
  }
}
