export interface NormalizedMetricsDto {
  entityId: string;
  entityType: 'Publication' | 'Campaign' | 'Business' | 'Workspace';
  provider?: string;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  followers: number;
  videoViews: number;
  watchTime: number;
  engagement: number;
  conversions: number;
  calculatedAt: Date;
}

export interface KPIHealthScore {
  score: number; // 0-100
  engagementRate: number;
  growthPercentage: number;
  completionRate: number;
}
