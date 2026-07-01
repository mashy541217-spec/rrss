import { Injectable, Logger } from '@nestjs/common';
import { ExecutionGraph, WorkflowNode, WorkflowEdge } from '../../domain/entities/ExecutionGraph';
import { ExecutionContext } from '../../domain/entities/ExecutionContext';

@Injectable()
export class WorkflowCompilerService {
  private readonly logger = new Logger(WorkflowCompilerService.name);

  public compile(workflowJson: any): ExecutionGraph {
    this.logger.log('Compiling UI Workflow into ExecutionGraph');
    
    // Parse Nodes
    const nodes = new Map<string, WorkflowNode>();
    for (const n of workflowJson.nodes || []) {
      nodes.set(n.id, {
        id: n.id,
        type: n.type,
        config: n.data || {},
      });
    }

    // Parse Edges
    const edges: WorkflowEdge[] = (workflowJson.edges || []).map((e: any) => ({
      sourceNodeId: e.source,
      targetNodeId: e.target,
      condition: e.data?.condition,
    }));

    // Build Graph
    const graph = new ExecutionGraph(nodes, edges);
    this.validateGraph(graph);

    return graph;
  }

  private validateGraph(graph: ExecutionGraph): void {
    // Check for cycles, isolated nodes, etc.
    const roots = graph.getRootNodes();
    if (roots.length === 0 && graph.nodes.size > 0) {
      throw new Error('Invalid Workflow: No root nodes found (possible cycle)');
    }
  }

  public createInitialContext(workflowId: string, workspaceId: string, businessId: string): ExecutionContext {
    return ExecutionContext.create({
      workflowId,
      workspaceId,
      businessId,
      correlationId: `corr-${Date.now()}`,
      traceId: `trace-${Date.now()}`,
      credentialScope: ['workflow:execute'],
      variables: {},
    }, `exec-${Date.now()}`);
  }
}
