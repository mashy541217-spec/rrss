import { WorkflowNode } from '../entities/WorkflowNode';
import { WorkflowConnection } from '../entities/WorkflowConnection';
import { ExecutionStrategy } from '../enums/ExecutionStrategy';

export class ExecutionPlanPolicy {
  public static generatePlan(
    nodes: WorkflowNode[],
    connections: WorkflowConnection[],
    strategy: ExecutionStrategy = ExecutionStrategy.Sequential
  ): any {
    const actionNodes = nodes.filter(n => n.type === 'Action');
    const steps = actionNodes.map((node, index) => ({
      id: node.id.value,
      name: node.name,
      order: index + 1,
      capabilityType: node.config?.capabilityType || 'generic-action',
      status: 'PENDING',
      config: node.config || {},
    }));

    return {
      strategy,
      steps,
    };
  }
}
