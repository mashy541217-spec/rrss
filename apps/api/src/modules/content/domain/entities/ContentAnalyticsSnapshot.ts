import { Entity } from '@rrss-auto/domain';

export interface ContentAnalyticsSnapshotProps {
  id: string;
  contentId: string;
  impressions: number;
  reach: number;
  engagements: number;
  clicks: number;
  shares: number;
  saves: number;
  comments: number;
  likes: number;
  snapshotAt: Date;
  platformRef?: string; // Platform-specific ID if sourced from external
  rawData?: Record<string, unknown>;
}

export class ContentAnalyticsSnapshot extends Entity<ContentAnalyticsSnapshotProps, any> {
  public get id(): string { return this.props.id; }
  public get contentId(): string { return this.props.contentId; }
  public get impressions(): number { return this.props.impressions; }
  public get reach(): number { return this.props.reach; }
  public get engagements(): number { return this.props.engagements; }
  public get clicks(): number { return this.props.clicks; }
  public get shares(): number { return this.props.shares; }
  public get saves(): number { return this.props.saves; }
  public get comments(): number { return this.props.comments; }
  public get likes(): number { return this.props.likes; }
  public get snapshotAt(): Date { return this.props.snapshotAt; }
  public get platformRef(): string | undefined { return this.props.platformRef; }
  public get engagementRate(): number {
    return this.props.reach > 0 ? this.props.engagements / this.props.reach : 0;
  }

  private constructor(props: ContentAnalyticsSnapshotProps) {
    super(props, props.id as any);
  }

  public static create(props: ContentAnalyticsSnapshotProps): ContentAnalyticsSnapshot {
    return new ContentAnalyticsSnapshot(props);
  }
}
