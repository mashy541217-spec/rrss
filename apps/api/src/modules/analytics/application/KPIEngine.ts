import { Injectable } from '@nestjs/common';
import { NormalizedMetricsDto, KPIHealthScore } from '../domain/AnalyticsTypes';

@Injectable()
export class KPIEngine {
  
  public calculateDerivedMetrics(metrics: NormalizedMetricsDto): NormalizedMetricsDto {
    const rawEngagement = metrics.likes + metrics.comments + metrics.shares + metrics.saves + metrics.clicks;
    metrics.engagement = rawEngagement;
    return metrics;
  }

  public calculateHealthScore(current: NormalizedMetricsDto, previous?: NormalizedMetricsDto): KPIHealthScore {
    const engagementRate = current.reach > 0 ? (current.engagement / current.reach) * 100 : 0;
    
    let growthPercentage = 0;
    if (previous && previous.reach > 0) {
      growthPercentage = ((current.reach - previous.reach) / previous.reach) * 100;
    }

    // Arbitrary health score calculation for prototype
    const score = Math.min(100, Math.max(0, (engagementRate * 5) + (growthPercentage * 2)));

    return {
      score,
      engagementRate,
      growthPercentage,
      completionRate: 100, // Tied to publication status
    };
  }
}
