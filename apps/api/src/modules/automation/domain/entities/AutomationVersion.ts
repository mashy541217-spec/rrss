import { Entity, ValueObject } from '@rrss-auto/domain';
import { AutomationVersionStatus } from '../enums/AutomationVersionStatus';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowConnection } from './WorkflowConnection';
import { VariableDefinition } from './VariableDefinition';
import { TriggerDefinition } from './TriggerDefinition';

export class VersionId extends ValueObject<{ value: string }> {
  get value(): string { return this.props.value; }
  static create(value: string): VersionId { return new VersionId({ value }); }
}

interface AutomationVersionProps {
  automationId: string;
  versionNumber: number;
  status: AutomationVersionStatus;
  trigger?: TriggerDefinition;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  variables: VariableDefinition[];
  executionPlan?: any;
  createdAt: Date;
}

export class AutomationVersion extends Entity<AutomationVersionProps, VersionId> {
  private constructor(props: AutomationVersionProps, id: VersionId) {
    super(props, id);
  }

  get automationId(): string { return this.props.automationId; }
  get versionNumber(): number { return this.props.versionNumber; }
  get status(): AutomationVersionStatus { return this.props.status; }
  get trigger(): TriggerDefinition | undefined { return this.props.trigger; }
  get nodes(): WorkflowNode[] { return this.props.nodes; }
  get connections(): WorkflowConnection[] { return this.props.connections; }
  get variables(): VariableDefinition[] { return this.props.variables; }
  get executionPlan(): any | undefined { return this.props.executionPlan; }
  get createdAt(): Date { return this.props.createdAt; }

  public static create(props: AutomationVersionProps, id: VersionId): AutomationVersion {
    return new AutomationVersion(props, id);
  }
}
