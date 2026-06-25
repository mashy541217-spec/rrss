import { MetaBaseClient } from './MetaBaseClient';

export interface MetaInsightMetricResponse {
  name: string;
  period: string;
  values: Array<{ value: number }>;
  title?: string;
  description?: string;
  id: string;
}

export class MetaInsightsClient extends MetaBaseClient {
  public async getMediaInsights(mediaId: string, metrics: string[]): Promise<{ data: MetaInsightMetricResponse[] }> {
    return this.get<{ data: MetaInsightMetricResponse[] }>(`${mediaId}/insights`, {
      metric: metrics.join(',')
    });
  }

  public async getUserInsights(userId: string, metrics: string[], period: string): Promise<{ data: MetaInsightMetricResponse[] }> {
    return this.get<{ data: MetaInsightMetricResponse[] }>(`${userId}/insights`, {
      metric: metrics.join(','),
      period
    });
  }
}
