import { Entity } from '@rrss-auto/domain';

export interface CampaignAnalyticsProps {
  clicks: number;
  impressions: number;
  conversionRate: number;
  engagementRate: number;
  additionalMetrics: Record<string, unknown>;
}

export class CampaignAnalytics extends Entity<CampaignAnalyticsProps, any> {
  private constructor(props: CampaignAnalyticsProps, id: string) { super(props, id); }
  get clicks(): number { return this.props.clicks; }
  get impressions(): number { return this.props.impressions; }
  get conversionRate(): number { return this.props.conversionRate; }
  get engagementRate(): number { return this.props.engagementRate; }
  get additionalMetrics(): Record<string, unknown> { return this.props.additionalMetrics; }

  public static create(props: CampaignAnalyticsProps, id: string): CampaignAnalytics {
    return new CampaignAnalytics(props, id);
  }

  public static empty(id: string): CampaignAnalytics {
    return new CampaignAnalytics({
      clicks: 0,
      impressions: 0,
      conversionRate: 0,
      engagementRate: 0,
      additionalMetrics: {}
    }, id);
  }
}