export enum NodeType {
  Trigger = 'Trigger',
  Delay = 'Delay',
  Condition = 'Condition',
  Publish = 'Publish',
  Wait = 'Wait',
  Notification = 'Notification',
  Webhook = 'Webhook',
  Variable = 'Variable',
  Merge = 'Merge',
  Branch = 'Branch',
  Finish = 'Finish',
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  config: Record<string, any>;
}

export interface WorkflowEdge {
  sourceNodeId: string;
  targetNodeId: string;
  condition?: string; // used for Branch/Condition nodes
}

export class ExecutionGraph {
  constructor(
    public readonly nodes: Map<string, WorkflowNode>,
    public readonly edges: WorkflowEdge[],
  ) {}

  public getRootNodes(): WorkflowNode[] {
    const targetIds = new Set(this.edges.map(e => e.targetNodeId));
    return Array.from(this.nodes.values()).filter(n => !targetIds.has(n.id));
  }

  public getNextNodes(nodeId: string, contextValues?: Record<string, any>): WorkflowNode[] {
    const outgoingEdges = this.edges.filter(e => e.sourceNodeId === nodeId);
    
    // Simplistic condition evaluator
    const validEdges = outgoingEdges.filter(e => {
      if (!e.condition) return true;
      // In reality, a robust expression evaluator is used here
      return contextValues?.[e.condition] === true; 
    });

    return validEdges
      .map(e => this.nodes.get(e.targetNodeId))
      .filter((n): n is WorkflowNode => n !== undefined);
  }
}
