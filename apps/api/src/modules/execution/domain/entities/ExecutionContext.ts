import { Entity, ValueObject } from '@rrss-auto/domain';

export enum ExecutionState {
  Created = 'Created',
  Compiling = 'Compiling',
  Queued = 'Queued',
  Running = 'Running',
  Waiting = 'Waiting',
  Paused = 'Paused',
  Retrying = 'Retrying',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
}

export interface ExecutionContextProps {
  workflowId: string;
  correlationId: string;
  traceId: string;
  workspaceId: string;
  businessId: string;
  campaignId?: string;
  publicationId?: string;
  credentialScope: string[];
  variables: Record<string, any>;
  state: ExecutionState;
  retryCount: number;
  parentExecutionId?: string;
  currentNodeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ExecutionContextId extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): ExecutionContextId { return new ExecutionContextId({ value }); }
}

export class ExecutionContext extends Entity<ExecutionContextProps, ExecutionContextId> {
  private constructor(props: ExecutionContextProps, id: ExecutionContextId) { super(props, id); }

  get state(): ExecutionState { return this.props.state; }
  get variables(): Record<string, any> { return this.props.variables; }
  get currentNodeId(): string | undefined { return this.props.currentNodeId; }

  public static create(props: Omit<ExecutionContextProps, 'state' | 'retryCount' | 'createdAt' | 'updatedAt'>, id: string): ExecutionContext {
    return new ExecutionContext({
      ...props,
      state: ExecutionState.Created,
      retryCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, ExecutionContextId.create(id));
  }

  public transitionTo(newState: ExecutionState): void {
    this.props.state = newState;
    this.props.updatedAt = new Date();
  }

  public setVariable(key: string, value: any): void {
    this.props.variables[key] = value;
    this.props.updatedAt = new Date();
  }

  public setCurrentNode(nodeId: string): void {
    this.props.currentNodeId = nodeId;
    this.props.updatedAt = new Date();
  }
}
