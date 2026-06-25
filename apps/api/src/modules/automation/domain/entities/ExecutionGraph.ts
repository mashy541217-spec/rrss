import { WorkflowNode } from './WorkflowNode';
import { WorkflowConnection } from './WorkflowConnection';

export class ExecutionGraph {
  constructor(
    public readonly nodes: WorkflowNode[],
    public readonly connections: WorkflowConnection[]
  ) {}

  public static create(nodes: WorkflowNode[], connections: WorkflowConnection[]): ExecutionGraph {
    return new ExecutionGraph(nodes, connections);
  }
}
