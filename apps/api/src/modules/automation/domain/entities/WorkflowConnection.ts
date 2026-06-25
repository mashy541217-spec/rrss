import { Entity } from '@rrss-auto/domain';
import { ConnectionId } from '../value-objects/ConnectionId';

interface WorkflowConnectionProps {
  sourceId: string;
  targetId: string;
  sourceHandle?: string;
  targetHandle?: string;
  condition?: string;
}

export class WorkflowConnection extends Entity<WorkflowConnectionProps, ConnectionId> {
  private constructor(props: WorkflowConnectionProps, id: ConnectionId) {
    super(props, id);
  }

  get sourceId(): string { return this.props.sourceId; }
  get targetId(): string { return this.props.targetId; }
  get sourceHandle(): string | undefined { return this.props.sourceHandle; }
  get targetHandle(): string | undefined { return this.props.targetHandle; }
  get condition(): string | undefined { return this.props.condition; }

  public static create(props: WorkflowConnectionProps, id: ConnectionId): WorkflowConnection {
    return new WorkflowConnection(props, id);
  }
}
