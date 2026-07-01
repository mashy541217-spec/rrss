import { Injectable, Logger } from '@nestjs/common';
import { NormalizedMetricsDto } from '../domain/AnalyticsTypes';

@Injectable()
export class MetricNormalizer {
  private readonly logger = new Logger(MetricNormalizer.name);

  public normalizeMetaPayload(publicationId: string, rawInsights: any): NormalizedMetricsDto {
    this.logger.log(`Normalizing Meta metrics for ${publicationId}`);
    return {
      entityId: publicationId,
      entityType: 'Publication',
      provider: 'Meta',
      reach: rawInsights.reach || 0,
      impressions: rawInsights.post_impressions || rawInsights.impressions || 0,
      likes: rawInsights.likes || 0,
      comments: rawInsights.comments || 0,
      shares: rawInsights.shares || 0,
      saves: rawInsights.saved || 0,
      clicks: rawInsights.clicks || 0,
      followers: rawInsights.follower_count || 0,
      videoViews: rawInsights.video_views || 0,
      watchTime: rawInsights.watch_time || 0,
      engagement: 0, // Calculated later
      conversions: 0,
      calculatedAt: new Date(),
    };
  }

  // Future ready: normalizeLinkedInPayload, normalizeTikTokPayload, etc.
}
