import { EventEmitter } from 'events';
import { SocialProvider } from '@rrss-auto/social-sdk';
import { SocialProfile } from '@rrss-auto/social-sdk';
import { SocialPage } from '@rrss-auto/social-sdk';
import { SocialSession } from '@rrss-auto/social-sdk';
import { SocialPublication } from '@rrss-auto/social-sdk';
import { SocialMediaAsset } from '@rrss-auto/social-sdk';
import { SocialComment } from '@rrss-auto/social-sdk';
import { SocialAnalytics } from '@rrss-auto/social-sdk';
import { SocialRateLimit } from '@rrss-auto/social-sdk';
import { MetaGraphApiClient, MetaRateLimiter, MetaMediaPipeline } from '@rrss-auto/meta-sdk';

export class InstagramProvider extends EventEmitter implements SocialProvider {
  readonly providerId = 'instagram';
  private readonly rateLimiter = new MetaRateLimiter();

  constructor(private readonly options?: { mock?: boolean }) {
    super();
  }

  private getClient(credentials: Record<string, any>): MetaGraphApiClient {
    const token = credentials.token || credentials.accessToken || '';
    return new MetaGraphApiClient(token, { mock: this.options?.mock });
  }

  public async authenticate(credentials: Record<string, any>): Promise<SocialSession> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const isValid = await client.auth.validateToken();
      if (!isValid) {
        throw new Error('Authentication failed: Invalid credentials');
      }

      this.emit('InstagramAuthenticated', { timestamp: new Date() });

      return {
        token: credentials.token || 'access-token',
        expiresAt: credentials.expiresAt || new Date(Date.now() + 3600 * 1000),
        scopes: credentials.scopes || ['instagram_basic', 'instagram_content_publish']
      };
    });
  }

  public async refreshToken(refreshToken: string): Promise<SocialSession> {
    return this.rateLimiter.executeWithRetry(async () => {
      // Mock refresh response matching Facebook Graph exchange workflow
      return {
        token: `refreshed-token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000), // 60 days
        scopes: ['instagram_basic', 'instagram_content_publish']
      };
    });
  }

  public async validateConnection(credentials: Record<string, any>): Promise<boolean> {
    try {
      const client = this.getClient(credentials);
      return await client.auth.validateToken();
    } catch {
      return false;
    }
  }

  public async getProfile(accountId: string, credentials: Record<string, any>): Promise<SocialProfile> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const raw = await client.user.getUserProfile(accountId);
      return {
        id: raw.id,
        username: raw.username,
        displayName: raw.name,
        bio: raw.biography,
        followersCount: raw.followers_count,
        isVerified: raw.is_verified,
        profilePictureUrl: raw.profile_picture_url
      };
    });
  }

  public async getPages(accountId: string, credentials: Record<string, any>): Promise<SocialPage[]> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const raw = await client.user.getLinkedInstagramAccounts();
      const data = raw.data || [];
      return data
        .filter((page: any) => page.instagram_business_account)
        .map((page: any) => ({
          id: page.instagram_business_account.id,
          name: page.name,
          category: page.category || 'Business',
          accessToken: page.access_token || credentials.token,
          instagramBusinessId: page.instagram_business_account.id
        }));
    });
  }

  public async publishContent(
    pageOrAccountId: string,
    content: string,
    mediaAssets: SocialMediaAsset[],
    credentials: Record<string, any>,
    options?: Record<string, any>
  ): Promise<SocialPublication> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      try {
        let containerId = '';

        if (mediaAssets.length === 0) {
          throw new Error('Instagram requires at least one media asset to publish content');
        }

        if (mediaAssets.length === 1) {
          const asset = mediaAssets[0];
          if (asset.assetType === 'VIDEO') {
            const container = await client.media.createVideoContainer(pageOrAccountId, asset.url, content);
            containerId = container.id;
          } else {
            const container = await client.media.createPhotoContainer(pageOrAccountId, asset.url, content);
            containerId = container.id;
          }
        } else {
          // Carousel
          const childrenIds: string[] = [];
          for (const asset of mediaAssets) {
            let itemContainer;
            if (asset.assetType === 'VIDEO') {
              itemContainer = await client.media.createVideoContainer(pageOrAccountId, asset.url);
            } else {
              itemContainer = await client.media.createPhotoContainer(pageOrAccountId, asset.url);
            }
            childrenIds.push(itemContainer.id);
          }
          const container = await client.media.createCarouselContainer(pageOrAccountId, childrenIds, content);
          containerId = container.id;
        }

        // Poll status of the container (mandatory for Reels and large images processing)
        const pipeline = new MetaMediaPipeline(client.media);
        await pipeline.waitForContainerReady(containerId);

        // Publish
        const publishResult = await client.publication.publishMediaContainer(pageOrAccountId, containerId);
        const details = await client.publication.getPublicationDetails(publishResult.id);

        const publication: SocialPublication = {
          id: details.id,
          providerId: this.providerId,
          url: details.permalink,
          textContent: content,
          mediaUrls: mediaAssets.map(a => a.url),
          publishedAt: new Date(details.timestamp),
          status: 'PUBLISHED',
          metadata: options
        };

        this.emit('InstagramPublicationSucceeded', { publicationId: details.id, timestamp: new Date() });
        return publication;

      } catch (error: any) {
        this.emit('InstagramPublicationFailed', { error: error.message, timestamp: new Date() });
        throw error;
      }
    });
  }

  public async deletePublication(publicationId: string, credentials: Record<string, any>): Promise<boolean> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const res = await client.publication.deletePublication(publicationId);
      if (res.success) {
        this.emit('InstagramDisconnected', { credentialId: publicationId, timestamp: new Date() });
        return true;
      }
      return false;
    });
  }

  public async uploadMedia(mediaUrl: string, filename: string, contentType: string, credentials: Record<string, any>): Promise<SocialMediaAsset> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      // Mock uploading locally
      return {
        id: `mock-media-id-${Date.now()}`,
        url: mediaUrl,
        assetType: contentType.startsWith('video/') ? 'VIDEO' : 'IMAGE',
        mimeType: contentType
      };
    });
  }

  public async downloadMedia(mediaId: string, credentials: Record<string, any>): Promise<any> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      return Buffer.from(`mock-media-stream-for-${mediaId}`);
    });
  }

  public async getInsights(publicationIdOrAccountId: string, credentials: Record<string, any>): Promise<SocialAnalytics> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      // For Instagram media insights, query reach, impressions, engagement, likes, comments, shares, saved
      const raw = await client.insights.getMediaInsights(publicationIdOrAccountId, [
        'impressions',
        'reach',
        'likes',
        'comments',
        'shares',
        'saved',
        'video_views'
      ]);

      const getMetric = (name: string): number => {
        const item = raw.data.find(d => d.name === name);
        return item?.values?.[0]?.value || 0;
      };

      const likesCount = getMetric('likes');
      const commentsCount = getMetric('comments');

      return {
        impressions: getMetric('impressions'),
        reach: getMetric('reach'),
        clicks: getMetric('clicks'), // generic click mapping
        shares: getMetric('shares'),
        engagementRate: (likesCount + commentsCount) / Math.max(1, getMetric('reach')),
        reactions: [
          { type: 'LIKE', count: likesCount }
        ],
        additionalInsights: {
          saved: getMetric('saved'),
          videoViews: getMetric('video_views')
        }
      };
    });
  }

  public async readComments(publicationId: string, credentials: Record<string, any>, limit?: number): Promise<SocialComment[]> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const raw = await client.user.getComments(publicationId);
      const data = raw.data || [];
      const comments = data.map((item: any) => ({
        id: item.id,
        publicationId,
        authorId: item.username || 'unknown',
        authorName: item.username || 'unknown',
        text: item.text,
        createdAt: new Date(item.timestamp)
      }));

      if (limit) {
        return comments.slice(0, limit);
      }
      return comments;
    });
  }

  public async replyComment(commentId: string, text: string, credentials: Record<string, any>): Promise<SocialComment> {
    const client = this.getClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const res = await client.user.replyComment(commentId, text);
      return {
        id: res.id,
        publicationId: 'unknown',
        authorId: 'me',
        authorName: 'me',
        text: text,
        createdAt: new Date()
      };
    });
  }

  public async likePublication(publicationId: string, credentials: Record<string, any>): Promise<boolean> {
    return true; // Simple mock, likes not fully mutable via Meta API anymore
  }

  public async getRateLimitStatus(credentials: Record<string, any>): Promise<SocialRateLimit> {
    return this.rateLimiter.getRateLimitStatus();
  }
}
