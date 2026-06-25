import { IDomainEvent, ValueObject } from '@rrss-auto/domain';

class StringVO extends ValueObject<{ value: string }> {
  get value(): string { return this.props.value; }
  static of(value: string): StringVO { return new StringVO({ value }); }
}

export class AutomationCreated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly automationId: string,
    public readonly workspaceRef: string,
    public readonly name: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}

export class AutomationPublished implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly automationId: string,
    public readonly versionNumber: number
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}

export class AutomationPaused implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly automationId: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}

export class AutomationArchived implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly automationId: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}

export class WorkflowUpdated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly automationId: string,
    public readonly nodeCount: number,
    public readonly connectionCount: number
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}

export class TriggerAdded implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly automationId: string,
    public readonly triggerType: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}

export class ActionAdded implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly automationId: string,
    public readonly actionType: string,
    public readonly actionName: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}

export class ConditionAdded implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly automationId: string,
    public readonly conditionType: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}

export class ExecutionPlanGenerated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly automationId: string,
    public readonly planId: string,
    public readonly stepCount: number
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}

export class AutomationExecuted implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly automationId: string,
    public readonly executionPlanId: string,
    public readonly triggeredBy: string
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.automationId); }
}
