import { SocialReaction } from './SocialReaction';

export interface SocialAnalytics {
  readonly impressions: number;
  readonly reach: number;
  readonly clicks: number;
  readonly shares: number;
  readonly engagementRate: number;
  readonly reactions: SocialReaction[];
  readonly additionalInsights?: Record<string, any>;
}
