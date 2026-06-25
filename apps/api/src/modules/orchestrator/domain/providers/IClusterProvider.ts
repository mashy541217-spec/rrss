export interface IClusterProvider {
  /**
   * Scales a specific deployment or worker group to the desired number of replicas.
   */
  scaleDeployment(clusterId: string, desiredReplicas: number): Promise<void>;

  /**
   * Safely cordons a node so it stops receiving new jobs, preparing for termination.
   */
  cordonNode(nodeId: string): Promise<void>;

  /**
   * Forcibly terminates a node.
   */
  terminateNode(nodeId: string): Promise<void>;

  /**
   * Retrieves the current number of running replicas for a cluster.
   */
  getReplicaCount(clusterId: string): Promise<number>;
}
