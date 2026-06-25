import { WorkflowNode } from '../entities/WorkflowNode';
import { WorkflowConnection } from '../entities/WorkflowConnection';
import { NodeType } from '../enums/NodeType';

export class WorkflowValidationPolicy {
  public static validate(nodes: WorkflowNode[], connections: WorkflowConnection[]): boolean {
    if (nodes.length === 0) return false;
    const triggerNodes = nodes.filter(n => n.type === NodeType.Trigger);
    if (triggerNodes.length === 0) return false; // Must have at least one trigger node

    const adj: Map<string, string[]> = new Map();
    const inDegree: Map<string, number> = new Map();

    for (const node of nodes) {
      adj.set(node.id.value, []);
      inDegree.set(node.id.value, 0);
    }

    for (const conn of connections) {
      const u = conn.sourceId;
      const v = conn.targetId;
      if (!adj.has(u) || !adj.has(v)) {
        return false; // Connection to non-existent nodes
      }
      adj.get(u)!.push(v);
      inDegree.set(v, (inDegree.get(v) || 0) + 1);
    }

    const queue: string[] = [];
    for (const [nodeId, deg] of inDegree.entries()) {
      if (deg === 0) {
        queue.push(nodeId);
      }
    }

    let visitedCount = 0;
    while (queue.length > 0) {
      const curr = queue.shift()!;
      visitedCount++;
      const neighbors = adj.get(curr) || [];
      for (const neighbor of neighbors) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    return visitedCount === nodes.length;
  }
}
