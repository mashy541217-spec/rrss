import { IDomainEvent, ValueObject } from '@rrss-auto/domain';

export class EventId extends ValueObject<{value: string}> {
  private constructor(props: {value: string}) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): EventId { return new EventId({value}); }
}

export class PublicationUpdated implements IDomainEvent {
  public readonly occurredAt: Date = new Date();
  constructor(
    public readonly publicationId: string,
    public readonly newStatus: string,
    public readonly timestamp: Date = new Date()
  ) {}
  getAggregateId(): ValueObject<any> { return EventId.create(this.publicationId); }
}

export class PublicationInsightUpdated implements IDomainEvent {
  public readonly occurredAt: Date = new Date();
  constructor(
    public readonly publicationId: string,
    public readonly metrics: Record<string, number>,
    public readonly timestamp: Date = new Date()
  ) {}
  getAggregateId(): ValueObject<any> { return EventId.create(this.publicationId); }
}

export class CampaignProgressUpdated implements IDomainEvent {
  public readonly occurredAt: Date = new Date();
  constructor(
    public readonly campaignId: string,
    public readonly progressPercentage: number
  ) {}
  getAggregateId(): ValueObject<any> { return EventId.create(this.campaignId); }
}

export class AnalyticsUpdated implements IDomainEvent {
  public readonly occurredAt: Date = new Date();
  constructor(
    public readonly campaignId: string,
    public readonly analyticsData: Record<string, any>
  ) {}
  getAggregateId(): ValueObject<any> { return EventId.create(this.campaignId); }
}
