import { SocialProfile } from '../models/SocialProfile';
import { SocialPage } from '../models/SocialPage';
import { SocialSession } from '../models/SocialSession';
import { SocialPublication } from '../models/SocialPublication';
import { SocialMediaAsset } from '../models/SocialMediaAsset';
import { SocialComment } from '../models/SocialComment';
import { SocialAnalytics } from '../models/SocialAnalytics';
import { SocialRateLimit } from '../models/SocialRateLimit';

export interface SocialProvider {
  readonly providerId: string;

  authenticate(credentials: Record<string, any>): Promise<SocialSession>;
  refreshToken(refreshToken: string): Promise<SocialSession>;
  validateConnection(credentials: Record<string, any>): Promise<boolean>;

  getProfile(accountId: string, credentials: Record<string, any>): Promise<SocialProfile>;
  getPages(accountId: string, credentials: Record<string, any>): Promise<SocialPage[]>;

  publishContent(
    pageOrAccountId: string,
    content: string,
    mediaAssets: SocialMediaAsset[],
    credentials: Record<string, any>,
    options?: Record<string, any>
  ): Promise<SocialPublication>;

  deletePublication(
    publicationId: string,
    credentials: Record<string, any>
  ): Promise<boolean>;

  uploadMedia(
    mediaUrl: string,
    filename: string,
    contentType: string,
    credentials: Record<string, any>
  ): Promise<SocialMediaAsset>;

  downloadMedia(
    mediaId: string,
    credentials: Record<string, any>
  ): Promise<any>;

  getInsights(
    publicationIdOrAccountId: string,
    credentials: Record<string, any>
  ): Promise<SocialAnalytics>;

  readComments(
    publicationId: string,
    credentials: Record<string, any>,
    limit?: number
  ): Promise<SocialComment[]>;

  replyComment(
    commentId: string,
    text: string,
    credentials: Record<string, any>
  ): Promise<SocialComment>;

  likePublication(
    publicationId: string,
    credentials: Record<string, any>
  ): Promise<boolean>;

  getRateLimitStatus?(
    credentials: Record<string, any>
  ): Promise<SocialRateLimit>;
}
