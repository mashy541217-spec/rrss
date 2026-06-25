import { Entity } from '@rrss-auto/domain';
import { NodeId } from '../value-objects/NodeId';
import { NodeType } from '../enums/NodeType';

interface WorkflowNodeProps {
  name: string;
  type: NodeType;
  config: any;
  positionX: number;
  positionY: number;
}

export class WorkflowNode extends Entity<WorkflowNodeProps, NodeId> {
  private constructor(props: WorkflowNodeProps, id: NodeId) {
    super(props, id);
  }

  get name(): string { return this.props.name; }
  get type(): NodeType { return this.props.type; }
  get config(): any { return this.props.config; }
  get positionX(): number { return this.props.positionX; }
  get positionY(): number { return this.props.positionY; }

  public static create(props: WorkflowNodeProps, id: NodeId): WorkflowNode {
    return new WorkflowNode(props, id);
  }
}
