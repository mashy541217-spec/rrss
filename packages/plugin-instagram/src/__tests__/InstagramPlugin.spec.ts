import { InstagramPlugin } from '../plugin/InstagramPlugin';
import { MetaGraphApiClient, MetaWebhookVerifier, MetaRateLimiter } from '@rrss-auto/meta-sdk';
import { InstagramFeatureFlags } from '../plugin/InstagramFeatureFlags';

describe('Instagram Provider Plugin reference implementation', () => {
  let plugin: InstagramPlugin;
  const mockConfig = {
    settings: {
      appId: 'mock-app-123',
      appSecret: 'mock-app-secret',
      verifyToken: 'mock-verify-token'
    },
    credentials: { token: 'mock-access-token' }
  };
  const mockContext: any = {
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    },
    environment: {},
    services: {
      get: jest.fn()
    }
  };

  beforeEach(() => {
    plugin = new InstagramPlugin({ mock: true });
  });

  describe('Client Layer', () => {
    it('should initialize InstagramClient and sub-clients successfully', () => {
      const client = new MetaGraphApiClient('token', { mock: true });
      expect(client.auth).toBeDefined();
      expect(client.publication).toBeDefined();
      expect(client.media).toBeDefined();
      expect(client.insights).toBeDefined();
      expect(client.user).toBeDefined();
      expect(client.webhook).toBeDefined();
    });
  });

  describe('Feature Flags and Discoverability', () => {
    it('should expose correct feature flags', () => {
      expect(InstagramFeatureFlags.SupportsImages).toBe(true);
      expect(InstagramFeatureFlags.SupportsVideos).toBe(true);
      expect(InstagramFeatureFlags.SupportsCarousel).toBe(true);
      expect(InstagramFeatureFlags.SupportsInsights).toBe(true);
      expect(InstagramFeatureFlags.SupportsMessaging).toBe(false);
      expect(InstagramFeatureFlags.SupportsMentions).toBe(true);
    });
  });

  describe('Health Checks', () => {
    it('should pass health checks when token is valid', async () => {
      const status = await plugin.checkHealth(mockContext, mockConfig);
      expect(status.isHealthy).toBe(true);
      expect(status.message).toContain('ACTIVE');
    });

    it('should report unhealthy status on unauthorized token', async () => {
      const invalidConfig = {
        settings: {},
        credentials: { token: '' }
      };
      const status = await plugin.checkHealth(mockContext, invalidConfig);
      expect(status.isHealthy).toBe(false);
      expect(status.message).toContain('UNAUTHORIZED');
    });
  });

  describe('Rate Limiter', () => {
    it('should monitor and allow standard requests under limit', async () => {
      const limiter = new MetaRateLimiter();
      const statusBefore = limiter.getRateLimitStatus();
      expect(statusBefore.remaining).toBe(1000);

      const res = await limiter.executeWithRetry(async () => 'ok');
      expect(res).toBe('ok');

      const statusAfter = limiter.getRateLimitStatus();
      expect(statusAfter.remaining).toBe(999);
    });

    it('should trigger retry backoff when encountering rate limit', async () => {
      const limiter = new MetaRateLimiter();
      let callCount = 0;
      const fn = async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error('429 rate limit reached');
        }
        return 'success';
      };

      const result = await limiter.executeWithRetry(fn, 1, 10);
      expect(result).toBe('success');
      expect(callCount).toBe(2);
    });

    it('should throw error when max retries exceeded', async () => {
      const limiter = new MetaRateLimiter();
      const fn = async () => {
        throw new Error('429 rate limit reached');
      };

      await expect(limiter.executeWithRetry(fn, 1, 10)).rejects.toThrow('429 rate limit reached');
    });
  });

  describe('Webhook verification and event parsing', () => {
    let handler: MetaWebhookVerifier;

    beforeEach(() => {
      handler = new MetaWebhookVerifier('secret-key', 'verify-token');
    });

    it('should verify webhook subscription queries', async () => {
      const validQuery = {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'verify-token',
        'hub.challenge': '12345'
      };
      const isValid = await handler.verifyWebhook({}, validQuery);
      expect(isValid).toBe(true);

      const invalidQuery = {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'wrong-token'
      };
      expect(await handler.verifyWebhook({}, invalidQuery)).toBe(false);
    });

    it('should parse subscription WEBHOOK_VERIFIED event', async () => {
      const query = {
        'hub.mode': 'subscribe',
        'hub.challenge': 'challenge-code',
        'hub.verify_token': 'verify-token'
      };
      const event = await handler.parseWebhookEvent({}, {}, query);
      expect(event.eventType).toBe('WEBHOOK_VERIFIED');
      if (event.eventType === 'WEBHOOK_VERIFIED') {
        expect(event.data.challenge).toBe('challenge-code');
        expect(event.data.status).toBe('SUCCESS');
      } else {
        fail('Expected WEBHOOK_VERIFIED');
      }
    });

    it('should parse COMMENT_RECEIVED event', async () => {
      const body = {
        object: 'instagram',
        entry: [
          {
            id: 'page-1',
            time: 1700000000,
            changes: [
              {
                field: 'comments',
                value: {
                  id: 'comment-1',
                  text: 'Super Reel!',
                  media_id: 'post-1',
                  from: { id: 'user-1', username: 'john_doe' }
                }
              }
            ]
          }
        ]
      };

      const event = await handler.parseWebhookEvent({ 'x-hub-signature-256': 'mock' }, body, {});
      expect(event.eventType).toBe('COMMENT_RECEIVED');
      if (event.eventType === 'COMMENT_RECEIVED') {
        expect(event.data.commentId).toBe('comment-1');
        expect(event.data.text).toBe('Super Reel!');
        expect(event.data.authorName).toBe('john_doe');
      } else {
        fail('Expected COMMENT_RECEIVED');
      }
    });

    it('should parse Story/Media Insights PUBLICATION_UPDATED event', async () => {
      const body = {
        object: 'instagram',
        entry: [
          {
            id: 'page-1',
            time: 1700000000,
            changes: [
              {
                field: 'media_insights',
                value: {
                  media_id: 'post-1',
                  metrics: { impressions: 150 }
                }
              }
            ]
          }
        ]
      };

      const event = await handler.parseWebhookEvent({ 'x-hub-signature': 'mock' }, body, {});
      expect(event.eventType).toBe('PUBLICATION_UPDATED');
      if (event.eventType === 'PUBLICATION_UPDATED') {
        expect(event.data.publicationId).toBe('post-1');
        expect(event.data.metrics).toEqual({ impressions: 150 });
      } else {
        fail('Expected PUBLICATION_UPDATED');
      }
    });

    it('should parse mentions MESSAGE_RECEIVED event', async () => {
      const body = {
        object: 'instagram',
        entry: [
          {
            id: 'page-1',
            time: 1700000000,
            changes: [
              {
                field: 'mentions',
                value: {
                  comment_id: 'comm-1',
                  media_id: 'post-1',
                  sender_id: 'sender-1',
                  sender_username: 'sender_user',
                  text: 'Look at this @rrss-auto!'
                }
              }
            ]
          }
        ]
      };

      const event = await handler.parseWebhookEvent({ 'x-hub-signature-256': 'mock' }, body, {});
      expect(event.eventType).toBe('MESSAGE_RECEIVED');
      if (event.eventType === 'MESSAGE_RECEIVED') {
        expect(event.data.senderName).toBe('sender_user');
        expect(event.data.text).toContain('Mentioned in post');
      } else {
        fail('Expected MESSAGE_RECEIVED');
      }
    });
  });

  describe('Plugin Actions Execution', () => {
    it('should publish a single image successfully', async () => {
      const params = {
        targetId: 'page-id-1',
        body: 'Post content',
        mediaUrls: ['https://mock.url/image.jpg']
      };

      const result = await plugin.executeAction('PublishContent', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.externalId).toContain('mock-post-id');
      expect(result.url).toContain('https://instagram.com/p/');
    });

    it('should publish a carousel successfully', async () => {
      const params = {
        targetId: 'page-id-1',
        body: 'Post content carousel',
        mediaUrls: [
          'https://mock.url/image1.jpg',
          'https://mock.url/image2.jpg'
        ]
      };

      const result = await plugin.executeAction('PublishContent', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.externalId).toContain('mock-post-id');
    });

    it('should retrieve publication insights', async () => {
      const params = {
        publicationId: 'post-1'
      };

      const result = await plugin.executeAction('GetInsights', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.insights.impressions).toBe(120);
      expect(result.insights.reach).toBe(100);
      expect(result.insights.shares).toBe(5);
    });

    it('should upload media', async () => {
      const params = {
        mediaUrl: 'https://mock.url/media.jpg',
        filename: 'file.jpg',
        contentType: 'image/jpeg'
      };

      const result = await plugin.executeAction('UploadMedia', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.mediaId).toContain('mock-media-id');
    });

    it('should download media', async () => {
      const params = {
        mediaId: 'media-123'
      };

      const result = await plugin.executeAction('DownloadMedia', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.data.toString()).toContain('mock-media-stream-for-media-123');
    });
  });
});
