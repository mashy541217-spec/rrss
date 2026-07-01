import { IDomainEvent, ValueObject } from '@rrss-auto/domain';
import { NormalizedMetricsDto } from '../AnalyticsTypes';

export class EventId extends ValueObject<{value: string}> {
  private constructor(props: {value: string}) { super(props); }
  get value(): string { return this.props.value; }
  public static create(value: string): EventId { return new EventId({value}); }
}

export class AnalyticsUpdated implements IDomainEvent {
  public readonly occurredAt: Date = new Date();
  constructor(
    public readonly entityId: string,
    public readonly entityType: string,
    public readonly metrics: NormalizedMetricsDto
  ) {}
  getAggregateId(): ValueObject<any> { return EventId.create(this.entityId); }
}

export class CampaignAnalyticsUpdated extends AnalyticsUpdated {
  constructor(campaignId: string, metrics: NormalizedMetricsDto) {
    super(campaignId, 'Campaign', metrics);
  }
}

export class BusinessAnalyticsUpdated extends AnalyticsUpdated {
  constructor(businessId: string, metrics: NormalizedMetricsDto) {
    super(businessId, 'Business', metrics);
  }
}

export class WorkspaceAnalyticsUpdated extends AnalyticsUpdated {
  constructor(workspaceId: string, metrics: NormalizedMetricsDto) {
    super(workspaceId, 'Workspace', metrics);
  }
}
