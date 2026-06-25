import { Entity } from '@rrss-auto/domain';

export interface CampaignMetricSnapshotProps {
  campaignId: string;
  recordedAt: Date;
  metrics: Record<string, unknown>;
}

export class CampaignMetricSnapshot extends Entity<CampaignMetricSnapshotProps, any> {
  private constructor(props: CampaignMetricSnapshotProps, id: string) { super(props, id); }
  get campaignId(): string { return this.props.campaignId; }
  get recordedAt(): Date { return this.props.recordedAt; }
  get metrics(): Record<string, unknown> { return this.props.metrics; }

  public static create(props: CampaignMetricSnapshotProps, id: string): CampaignMetricSnapshot {
    return new CampaignMetricSnapshot(props, id);
  }
}