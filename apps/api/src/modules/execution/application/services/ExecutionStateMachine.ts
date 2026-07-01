import { Injectable, Logger } from '@nestjs/common';
import { ExecutionContext, ExecutionState } from '../../domain/entities/ExecutionContext';
import { ExecutionGraph, NodeType, WorkflowNode } from '../../domain/entities/ExecutionGraph';

@Injectable()
export class ExecutionStateMachine {
  private readonly logger = new Logger(ExecutionStateMachine.name);

  // In a real system, we'd inject the Queue Engine and Repositories
  constructor() {}

  public async step(context: ExecutionContext, graph: ExecutionGraph): Promise<void> {
    if (context.state !== ExecutionState.Running) return;

    const currentNodeId = context.currentNodeId;
    if (!currentNodeId) {
      // Start workflow
      const roots = graph.getRootNodes();
      if (roots.length > 0) {
        context.setCurrentNode(roots[0].id);
        await this.executeNode(roots[0], context);
      } else {
        context.transitionTo(ExecutionState.Completed);
      }
      return;
    }

    // Find next nodes
    const nextNodes = graph.getNextNodes(currentNodeId, context.variables);
    if (nextNodes.length === 0) {
      context.transitionTo(ExecutionState.Completed);
      this.logger.log(`Workflow ${context.id} completed.`);
      return;
    }

    if (nextNodes.length === 1) {
      context.setCurrentNode(nextNodes[0].id);
      await this.executeNode(nextNodes[0], context);
    } else {
      // Parallel or branched execution logic
      this.logger.log('Branching execution not fully implemented in mock');
      context.setCurrentNode(nextNodes[0].id);
      await this.executeNode(nextNodes[0], context);
    }
  }

  private async executeNode(node: WorkflowNode, context: ExecutionContext): Promise<void> {
    this.logger.log(`Executing node ${node.id} of type ${node.type}`);
    
    switch (node.type) {
      case NodeType.Delay:
        context.transitionTo(ExecutionState.Waiting);
        // Dispatch to Queue Engine with delay
        break;
      case NodeType.Publish:
        // Dispatch to Queue Engine
        break;
      case NodeType.Condition:
        // Evaluate condition and step immediately
        await this.step(context, null as any); // Graph needed here
        break;
      case NodeType.Finish:
        context.transitionTo(ExecutionState.Completed);
        break;
      default:
        // Push generic job to queue
        break;
    }
  }
}
