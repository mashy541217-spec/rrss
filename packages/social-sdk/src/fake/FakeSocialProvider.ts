import { SocialProvider } from '../operations/SocialProvider';
import { SocialProfile } from '../models/SocialProfile';
import { SocialPage } from '../models/SocialPage';
import { SocialSession } from '../models/SocialSession';
import { SocialPublication } from '../models/SocialPublication';
import { SocialMediaAsset } from '../models/SocialMediaAsset';
import { SocialComment } from '../models/SocialComment';
import { SocialAnalytics } from '../models/SocialAnalytics';
import { SocialRateLimit } from '../models/SocialRateLimit';
import {
  SocialWebhookHandler,
  SocialWebhookEvent
} from '../webhooks/SocialWebhook';

export class FakeSocialProvider implements SocialProvider, SocialWebhookHandler {
  readonly providerId = 'fake-provider';

  // In-memory data store for testing assertions
  private publications = new Map<string, SocialPublication>();
  private comments = new Map<string, SocialComment[]>();
  private replies = new Map<string, SocialComment[]>();

  async authenticate(credentials: Record<string, any>): Promise<SocialSession> {
    if (!credentials || Object.keys(credentials).length === 0) {
      throw new Error('Invalid credentials');
    }
    return {
      token: credentials.token || 'fake-access-token',
      expiresAt: new Date(Date.now() + 3600 * 1000),
      scopes: credentials.scopes || ['read', 'write']
    };
  }

  async refreshToken(refreshToken: string): Promise<SocialSession> {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    return {
      token: `refreshed-access-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600 * 1000),
      scopes: ['read', 'write']
    };
  }

  async validateConnection(credentials: Record<string, any>): Promise<boolean> {
    return !!credentials && (!!credentials.token || !!credentials.apiKey || !!credentials.username);
  }

  async getProfile(accountId: string, credentials: Record<string, any>): Promise<SocialProfile> {
    await this.authenticate(credentials);
    return {
      id: accountId,
      username: 'fakeuser',
      displayName: 'Fake User',
      profilePictureUrl: 'https://fake.com/profile.jpg',
      bio: 'This is a fake profile for testing',
      followersCount: 1000,
      isVerified: true
    };
  }

  async getPages(accountId: string, credentials: Record<string, any>): Promise<SocialPage[]> {
    await this.authenticate(credentials);
    return [
      {
        id: 'fake-page-1',
        name: 'Fake Page One',
        category: 'Testing',
        accessToken: 'fake-page-token-1'
      },
      {
        id: 'fake-page-2',
        name: 'Fake Page Two',
        category: 'Sandbox',
        accessToken: 'fake-page-token-2'
      }
    ];
  }

  async publishContent(
    pageOrAccountId: string,
    content: string,
    mediaAssets: SocialMediaAsset[],
    credentials: Record<string, any>,
    options?: Record<string, any>
  ): Promise<SocialPublication> {
    await this.authenticate(credentials);

    const publicationId = `fake-pub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const publication: SocialPublication = {
      id: publicationId,
      providerId: this.providerId,
      textContent: content,
      mediaUrls: mediaAssets.map(asset => asset.url),
      publishedAt: new Date(),
      status: 'PUBLISHED',
      url: `https://fake.com/p/${publicationId}`,
      metadata: options
    };

    this.publications.set(publicationId, publication);
    return publication;
  }

  async deletePublication(
    publicationId: string,
    credentials: Record<string, any>
  ): Promise<boolean> {
    await this.authenticate(credentials);
    if (this.publications.has(publicationId)) {
      this.publications.delete(publicationId);
      return true;
    }
    return false;
  }

  async uploadMedia(
    mediaUrl: string,
    filename: string,
    contentType: string,
    credentials: Record<string, any>
  ): Promise<SocialMediaAsset> {
    await this.authenticate(credentials);
    return {
      id: `fake-media-${Date.now()}`,
      url: mediaUrl,
      assetType: contentType.startsWith('video/') ? 'VIDEO' : 'IMAGE',
      mimeType: contentType
    };
  }

  async downloadMedia(
    mediaId: string,
    credentials: Record<string, any>
  ): Promise<any> {
    await this.authenticate(credentials);
    return Buffer.from(`mock-binary-data-for-${mediaId}`);
  }

  async getInsights(
    publicationIdOrAccountId: string,
    credentials: Record<string, any>
  ): Promise<SocialAnalytics> {
    await this.authenticate(credentials);
    return {
      impressions: 1500,
      reach: 1200,
      clicks: 85,
      shares: 10,
      engagementRate: 0.08,
      reactions: [
        { type: 'LIKE', count: 50 },
        { type: 'LOVE', count: 10 }
      ],
      additionalInsights: {
        commentsCount: 5
      }
    };
  }

  async readComments(
    publicationId: string,
    credentials: Record<string, any>,
    limit?: number
  ): Promise<SocialComment[]> {
    await this.authenticate(credentials);
    const existing = this.comments.get(publicationId) || [
      {
        id: `fake-comment-1`,
        publicationId,
        authorId: 'user-1',
        authorName: 'Commenter One',
        text: 'This is a great test post!',
        createdAt: new Date()
      }
    ];

    if (limit) {
      return existing.slice(0, limit);
    }
    return existing;
  }

  async replyComment(
    commentId: string,
    text: string,
    credentials: Record<string, any>
  ): Promise<SocialComment> {
    await this.authenticate(credentials);
    const reply: SocialComment = {
      id: `fake-comment-reply-${Date.now()}`,
      publicationId: 'fake-pub-id',
      authorId: 'page-author',
      authorName: 'Page Owner',
      text,
      createdAt: new Date()
    };

    const existingReplies = this.replies.get(commentId) || [];
    existingReplies.push(reply);
    this.replies.set(commentId, existingReplies);

    return reply;
  }

  async likePublication(
    publicationId: string,
    credentials: Record<string, any>
  ): Promise<boolean> {
    await this.authenticate(credentials);
    return true;
  }

  async getRateLimitStatus(
    credentials: Record<string, any>
  ): Promise<SocialRateLimit> {
    await this.authenticate(credentials);
    return {
      limit: 1000,
      remaining: 995,
      resetTime: new Date(Date.now() + 3600 * 1000)
    };
  }

  // Webhook Handler Methods
  async verifyWebhook(headers: Record<string, string>, query: Record<string, string>): Promise<boolean> {
    // Simulate validation matching verify token
    const token = query['hub.verify_token'] || headers['x-hub-signature'];
    return token === 'fake-secret-token';
  }

  async parseWebhookEvent(
    headers: Record<string, string>,
    body: Record<string, any>,
    query: Record<string, string>
  ): Promise<SocialWebhookEvent> {
    const isVerified = await this.verifyWebhook(headers, query);
    
    if (query['hub.mode'] === 'subscribe') {
      return {
        providerId: this.providerId,
        eventType: 'WEBHOOK_VERIFIED',
        timestamp: new Date(),
        rawPayload: { query },
        data: {
          challenge: query['hub.challenge'],
          status: isVerified ? 'SUCCESS' : 'FAILED'
        }
      } as SocialWebhookEvent;
    }

    const event = body.event;
    switch (event) {
      case 'publication_created':
        return {
          providerId: this.providerId,
          eventType: 'PUBLICATION_CREATED',
          timestamp: new Date(body.timestamp || Date.now()),
          rawPayload: body,
          data: {
            publicationId: body.publicationId,
            accountId: body.accountId,
            content: body.content,
            mediaUrls: body.mediaUrls
          }
        } as SocialWebhookEvent;

      case 'publication_updated':
        return {
          providerId: this.providerId,
          eventType: 'PUBLICATION_UPDATED',
          timestamp: new Date(body.timestamp || Date.now()),
          rawPayload: body,
          data: {
            publicationId: body.publicationId,
            accountId: body.accountId,
            status: body.status,
            metrics: body.metrics
          }
        } as SocialWebhookEvent;

      case 'comment_received':
        return {
          providerId: this.providerId,
          eventType: 'COMMENT_RECEIVED',
          timestamp: new Date(body.timestamp || Date.now()),
          rawPayload: body,
          data: {
            commentId: body.commentId,
            publicationId: body.publicationId,
            authorId: body.authorId,
            authorName: body.authorName,
            text: body.text
          }
        } as SocialWebhookEvent;

      case 'message_received':
        return {
          providerId: this.providerId,
          eventType: 'MESSAGE_RECEIVED',
          timestamp: new Date(body.timestamp || Date.now()),
          rawPayload: body,
          data: {
            messageId: body.messageId,
            senderId: body.senderId,
            senderName: body.senderName,
            text: body.text
          }
        } as SocialWebhookEvent;

      case 'reaction_added':
        return {
          providerId: this.providerId,
          eventType: 'REACTION_ADDED',
          timestamp: new Date(body.timestamp || Date.now()),
          rawPayload: body,
          data: {
            publicationId: body.publicationId,
            commentId: body.commentId,
            reactorId: body.reactorId,
            reactionType: body.reactionType
          }
        } as SocialWebhookEvent;

      default:
        throw new Error(`Unsupported event type: ${event}`);
    }
  }

  // Testing helpers
  addMockComment(publicationId: string, comment: SocialComment) {
    const list = this.comments.get(publicationId) || [];
    list.push(comment);
    this.comments.set(publicationId, list);
  }

  getStoredPublication(publicationId: string): SocialPublication | undefined {
    return this.publications.get(publicationId);
  }

  getStoredReplies(commentId: string): SocialComment[] {
    return this.replies.get(commentId) || [];
  }

  clear() {
    this.publications.clear();
    this.comments.clear();
    this.replies.clear();
  }
}
