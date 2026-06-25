import { AggregateRoot } from '@rrss-auto/domain';
import { AutomationId } from '../value-objects/AutomationId';
import { AutomationStatus } from '../enums/AutomationStatus';
import { WorkflowNode } from '../entities/WorkflowNode';
import { WorkflowConnection } from '../entities/WorkflowConnection';
import { VariableDefinition } from '../entities/VariableDefinition';
import { TriggerDefinition } from '../entities/TriggerDefinition';
import { RetryPolicy } from '../value-objects/RetryPolicy';
import { Timeout } from '../value-objects/Timeout';

import {
  AutomationCreated,
  AutomationPublished,
  AutomationPaused,
  AutomationArchived,
  WorkflowUpdated,
  TriggerAdded,
  ActionAdded,
  ConditionAdded,
  ExecutionPlanGenerated,
  AutomationExecuted,
} from '../events/AutomationEvents';

import { WorkflowValidSpecification } from '../specifications/WorkflowValidSpecification';
import { ExecutionPlanPolicy } from '../policies/ExecutionPlanPolicy';
import { ExecutionStrategy } from '../enums/ExecutionStrategy';

export interface AutomationProps {
  workspaceRef: string;
  name: string;
  description?: string;
  status: AutomationStatus;
  variables: VariableDefinition[];
  trigger?: TriggerDefinition;
  retryConfig?: RetryPolicy;
  timeoutConfig?: Timeout;
  executionPlan?: any;

  nodes: WorkflowNode[];
  connections: WorkflowConnection[];

  version: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Automation extends AggregateRoot<AutomationProps, AutomationId> {
  private constructor(props: AutomationProps, id: AutomationId) {
    super(props, id);
  }

  // Getters
  get workspaceRef(): string { return this.props.workspaceRef; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get status(): AutomationStatus { return this.props.status; }
  get variables(): VariableDefinition[] { return [...this.props.variables]; }
  get trigger(): TriggerDefinition | undefined { return this.props.trigger; }
  get retryConfig(): RetryPolicy | undefined { return this.props.retryConfig; }
  get timeoutConfig(): Timeout | undefined { return this.props.timeoutConfig; }
  get executionPlan(): any | undefined { return this.props.executionPlan; }
  get nodes(): WorkflowNode[] { return [...this.props.nodes]; }
  get connections(): WorkflowConnection[] { return [...this.props.connections]; }
  get version(): number { return this.props.version; }
  get isDeleted(): boolean { return this.props.isDeleted; }
  get deletedAt(): Date | undefined { return this.props.deletedAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  // Factory Method
  public static create(
    id: AutomationId,
    props: Omit<AutomationProps, 'status' | 'version' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'variables' | 'nodes' | 'connections'>
  ): Automation {
    const automation = new Automation({
      ...props,
      status: AutomationStatus.Draft,
      variables: [],
      nodes: [],
      connections: [],
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, id);

    automation.addDomainEvent(new AutomationCreated(id.value, props.workspaceRef, props.name));
    return automation;
  }

  // Reconstitute factory
  public static reconstitute(props: AutomationProps, id: AutomationId): Automation {
    return new Automation(props, id);
  }

  // Update Workflow (Nodes and Connections)
  public typeUpdateWorkflow(nodes: WorkflowNode[], connections: WorkflowConnection[]): void {
    this.assertNotDeleted();
    if (this.props.status !== AutomationStatus.Draft && this.props.status !== AutomationStatus.Paused) {
      throw new Error('Can only update workflow in Draft or Paused state');
    }
    this.props.nodes = nodes;
    this.props.connections = connections;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new WorkflowUpdated(this.id.value, nodes.length, connections.length));
  }

  // Add Trigger
  public addTrigger(trigger: TriggerDefinition): void {
    this.assertNotDeleted();
    if (this.props.status !== AutomationStatus.Draft && this.props.status !== AutomationStatus.Paused) {
      throw new Error('Can only add trigger in Draft or Paused state');
    }
    this.props.trigger = trigger;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new TriggerAdded(this.id.value, trigger.type));
  }

  // Remove Trigger
  public removeTrigger(): void {
    this.assertNotDeleted();
    if (this.props.status !== AutomationStatus.Draft && this.props.status !== AutomationStatus.Paused) {
      throw new Error('Can only remove trigger in Draft or Paused state');
    }
    this.props.trigger = undefined;
    this.props.updatedAt = new Date();
  }

  // Add Condition
  public addCondition(condition: any): void {
    this.assertNotDeleted();
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ConditionAdded(this.id.value, condition.type || 'Filter'));
  }

  // Remove Condition
  public removeCondition(): void {
    this.assertNotDeleted();
    this.props.updatedAt = new Date();
  }

  // Add Action
  public addAction(action: any): void {
    this.assertNotDeleted();
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ActionAdded(this.id.value, action.type || 'Generic', action.name || 'Action'));
  }

  // Remove Action
  public removeAction(): void {
    this.assertNotDeleted();
    this.props.updatedAt = new Date();
  }

  // State Machine transitions
  public publish(): void {
    this.assertNotDeleted();
    if (this.props.status !== AutomationStatus.Draft && this.props.status !== AutomationStatus.Paused) {
      throw new Error(`Cannot publish automation from ${this.props.status} state`);
    }

    const workflowSpec = new WorkflowValidSpecification();
    if (!workflowSpec.isSatisfiedBy(this)) {
      throw new Error('Cannot publish automation: Workflow is invalid or cycle detected');
    }

    this.props.status = AutomationStatus.Published;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new AutomationPublished(this.id.value, this.props.version));
  }

  public run(): void {
    this.assertNotDeleted();
    if (this.props.status !== AutomationStatus.Published && this.props.status !== AutomationStatus.Paused) {
      throw new Error(`Cannot start automation from ${this.props.status} state`);
    }
    this.props.status = AutomationStatus.Running;
    this.props.updatedAt = new Date();
  }

  public pause(): void {
    this.assertNotDeleted();
    if (this.props.status !== AutomationStatus.Published && this.props.status !== AutomationStatus.Running) {
      throw new Error(`Cannot pause automation from ${this.props.status} state`);
    }
    this.props.status = AutomationStatus.Paused;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new AutomationPaused(this.id.value));
  }

  public archive(): void {
    this.assertNotDeleted();
    if (
      this.props.status !== AutomationStatus.Published &&
      this.props.status !== AutomationStatus.Paused &&
      this.props.status !== AutomationStatus.Running
    ) {
      throw new Error(`Cannot archive automation from ${this.props.status} state`);
    }
    this.props.status = AutomationStatus.Archived;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new AutomationArchived(this.id.value));
  }

  public delete(): void {
    this.assertNotDeleted();
    this.props.status = AutomationStatus.Deleted;
    this.props.isDeleted = true;
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  // Duplicate
  public duplicate(newId: AutomationId, newName: string): Automation {
    this.assertNotDeleted();
    return new Automation({
      ...this.props,
      name: newName,
      status: AutomationStatus.Draft,
      version: 1,
      isDeleted: false,
      deletedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, newId);
  }

  // Generate Execution Plan
  public generateExecutionPlan(strategy: ExecutionStrategy = ExecutionStrategy.Sequential): any {
    this.assertNotDeleted();
    const plan = ExecutionPlanPolicy.generatePlan(this.props.nodes, this.props.connections, strategy);
    this.props.executionPlan = plan;
    this.props.updatedAt = new Date();

    const planId = `plan-${Date.now()}`;
    this.addDomainEvent(new ExecutionPlanGenerated(this.id.value, planId, plan.steps.length));
    return plan;
  }

  // Execute the plan
  public execute(triggeredBy: string): void {
    this.assertNotDeleted();
    if (!this.props.executionPlan) {
      this.generateExecutionPlan();
    }
    const planId = `plan-${Date.now()}`;
    this.addDomainEvent(new AutomationExecuted(this.id.value, planId, triggeredBy));
  }

  private assertNotDeleted(): void {
    if (this.props.isDeleted) {
      throw new Error('Aggregate is deleted and cannot be modified');
    }
  }
}
