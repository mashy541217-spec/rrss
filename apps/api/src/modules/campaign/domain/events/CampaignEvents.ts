import { IDomainEvent, ValueObject } from '@rrss-auto/domain';

class StringVO extends ValueObject<{ value: string }> {
  get value(): string { return this.props.value; }
  static of(value: string): StringVO { return new StringVO({ value }); }
}

export class CampaignCreated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly campaignId: string,
    public readonly workspaceRef: string,
    public readonly name: string,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class CampaignActivated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly campaignId: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class CampaignPaused implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly campaignId: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class CampaignCompleted implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly campaignId: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class CampaignArchived implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly campaignId: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class PublicationCreated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly publicationId: string,
    public readonly campaignId: string,
    public readonly contentId: string,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class PublicationScheduled implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly publicationId: string,
    public readonly campaignId: string,
    public readonly publishAt: Date,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class PublicationCancelled implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly publicationId: string, public readonly campaignId: string) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class ContentAttached implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly campaignId: string,
    public readonly contentId: string,
    public readonly attachedBy: string,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class ChannelAdded implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly campaignId: string,
    public readonly channelId: string,
    public readonly platform: string,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class BudgetExceeded implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(
    public readonly campaignId: string,
    public readonly limitAmount: number,
    public readonly spentAmount: number,
  ) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}

export class CampaignMetricsUpdated implements IDomainEvent {
  public readonly occurredAt: Date;
  constructor(public readonly campaignId: string, public readonly clicks: number, public readonly impressions: number) {
    this.occurredAt = new Date();
  }
  getAggregateId(): ValueObject<any> { return StringVO.of(this.campaignId); }
}
