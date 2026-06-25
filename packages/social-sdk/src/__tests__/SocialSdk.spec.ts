import { FakeSocialProvider } from '../fake/FakeSocialProvider';
import { SocialMediaAsset } from '../models/SocialMediaAsset';
import { SocialComment } from '../models/SocialComment';
import { SocialWebhookEvent } from '../webhooks/SocialWebhook';

describe('Social Platform SDK Foundation', () => {
  let provider: FakeSocialProvider;
  const mockCredentials = { token: 'test-token-123' };

  beforeEach(() => {
    provider = new FakeSocialProvider();
  });

  describe('Authentication and Profile Operations', () => {
    it('should authenticate and return a valid session', async () => {
      const session = await provider.authenticate(mockCredentials);
      expect(session.token).toBe('test-token-123');
      expect(session.expiresAt).toBeInstanceOf(Date);
      expect(session.scopes).toContain('read');
    });

    it('should throw error when authenticating with empty credentials', async () => {
      await expect(provider.authenticate({})).rejects.toThrow('Invalid credentials');
    });

    it('should refresh token successfully', async () => {
      const session = await provider.refreshToken('refresh-123');
      expect(session.token).toContain('refreshed-access-token');
      expect(session.scopes).toContain('read');
    });

    it('should throw error when refreshing with empty token', async () => {
      await expect(provider.refreshToken('')).rejects.toThrow('Refresh token is required');
    });

    it('should validate connection credentials correctly', async () => {
      expect(await provider.validateConnection(mockCredentials)).toBe(true);
      expect(await provider.validateConnection({ apiKey: 'api-key-123' })).toBe(true);
      expect(await provider.validateConnection({})).toBe(false);
    });

    it('should retrieve profile properties successfully', async () => {
      const profile = await provider.getProfile('acc-123', mockCredentials);
      expect(profile.id).toBe('acc-123');
      expect(profile.username).toBe('fakeuser');
      expect(profile.isVerified).toBe(true);
      expect(profile.followersCount).toBe(1000);
    });

    it('should retrieve list of pages for account', async () => {
      const pages = await provider.getPages('acc-123', mockCredentials);
      expect(pages).toHaveLength(2);
      expect(pages[0].id).toBe('fake-page-1');
      expect(pages[0].name).toBe('Fake Page One');
    });
  });

  describe('Publication and Media Operations', () => {
    it('should publish content and map properties', async () => {
      const mediaAssets: SocialMediaAsset[] = [
        { id: 'media-1', url: 'https://fake.com/image.png', assetType: 'IMAGE' }
      ];

      const pub = await provider.publishContent(
        'fake-page-1',
        'Hello automation!',
        mediaAssets,
        mockCredentials,
        { scheduleAt: 'later' }
      );

      expect(pub.id).toBeDefined();
      expect(pub.providerId).toBe('fake-provider');
      expect(pub.textContent).toBe('Hello automation!');
      expect(pub.mediaUrls).toEqual(['https://fake.com/image.png']);
      expect(pub.status).toBe('PUBLISHED');
      expect(pub.metadata).toEqual({ scheduleAt: 'later' });

      // Retrieve from memory store
      const stored = provider.getStoredPublication(pub.id);
      expect(stored).toBeDefined();
      expect(stored?.textContent).toBe('Hello automation!');
    });

    it('should delete a publication', async () => {
      const pub = await provider.publishContent('fake-page-1', 'To be deleted', [], mockCredentials);
      const existsBefore = provider.getStoredPublication(pub.id);
      expect(existsBefore).toBeDefined();

      const deleted = await provider.deletePublication(pub.id, mockCredentials);
      expect(deleted).toBe(true);

      const existsAfter = provider.getStoredPublication(pub.id);
      expect(existsAfter).toBeUndefined();
    });

    it('should return false when deleting non-existent publication', async () => {
      const deleted = await provider.deletePublication('non-existent', mockCredentials);
      expect(deleted).toBe(false);
    });

    it('should upload a media asset successfully', async () => {
      const asset = await provider.uploadMedia(
        'https://myurl.com/asset.mp4',
        'asset.mp4',
        'video/mp4',
        mockCredentials
      );

      expect(asset.id).toContain('fake-media');
      expect(asset.url).toBe('https://myurl.com/asset.mp4');
      expect(asset.assetType).toBe('VIDEO');
      expect(asset.mimeType).toBe('video/mp4');
    });

    it('should download a media asset stream', async () => {
      const stream = await provider.downloadMedia('media-123', mockCredentials);
      expect(stream.toString()).toContain('mock-binary-data-for-media-123');
    });
  });

  describe('Comment and Engagement Operations', () => {
    it('should read comments and enforce limit', async () => {
      const pubId = 'pub-1';
      const comment1: SocialComment = {
        id: 'c-1',
        publicationId: pubId,
        authorId: 'u-1',
        authorName: 'User One',
        text: 'First!',
        createdAt: new Date()
      };
      const comment2: SocialComment = {
        id: 'c-2',
        publicationId: pubId,
        authorId: 'u-2',
        authorName: 'User Two',
        text: 'Second!',
        createdAt: new Date()
      };

      provider.addMockComment(pubId, comment1);
      provider.addMockComment(pubId, comment2);

      const comments = await provider.readComments(pubId, mockCredentials);
      expect(comments).toHaveLength(2);
      expect(comments[0].text).toBe('First!');

      const limitedComments = await provider.readComments(pubId, mockCredentials, 1);
      expect(limitedComments).toHaveLength(1);
      expect(limitedComments[0].text).toBe('First!');
    });

    it('should reply to a comment and save replies in provider memory', async () => {
      const reply = await provider.replyComment('c-1', 'Thank you!', mockCredentials);
      expect(reply.id).toBeDefined();
      expect(reply.text).toBe('Thank you!');

      const replies = provider.getStoredReplies('c-1');
      expect(replies).toHaveLength(1);
      expect(replies[0].text).toBe('Thank you!');
    });

    it('should like a publication', async () => {
      const result = await provider.likePublication('pub-1', mockCredentials);
      expect(result).toBe(true);
    });
  });

  describe('Analytics and Limits Operations', () => {
    it('should retrieve insights for account or publication', async () => {
      const insights = await provider.getInsights('pub-1', mockCredentials);
      expect(insights.impressions).toBe(1500);
      expect(insights.reach).toBe(1200);
      expect(insights.clicks).toBe(85);
      expect(insights.shares).toBe(10);
      expect(insights.engagementRate).toBe(0.08);
      expect(insights.reactions).toEqual([
        { type: 'LIKE', count: 50 },
        { type: 'LOVE', count: 10 }
      ]);
    });

    it('should fetch rate limit status', async () => {
      const rateLimit = await provider.getRateLimitStatus(mockCredentials);
      expect(rateLimit.limit).toBe(1000);
      expect(rateLimit.remaining).toBe(995);
      expect(rateLimit.resetTime).toBeInstanceOf(Date);
    });
  });

  describe('Webhook Operations', () => {
    const headers = { 'x-hub-signature': 'fake-secret-token' };
    const invalidHeaders = { 'x-hub-signature': 'invalid-token' };

    it('should verify webhook subscription queries', async () => {
      const validQuery = { 'hub.verify_token': 'fake-secret-token' };
      const invalidQuery = { 'hub.verify_token': 'wrong-token' };

      expect(await provider.verifyWebhook({}, validQuery)).toBe(true);
      expect(await provider.verifyWebhook(headers, {})).toBe(true);
      expect(await provider.verifyWebhook(invalidHeaders, invalidQuery)).toBe(false);
    });

    it('should parse WEBHOOK_VERIFIED event', async () => {
      const query = {
        'hub.mode': 'subscribe',
        'hub.challenge': 'challenge-code',
        'hub.verify_token': 'fake-secret-token'
      };

      const event = await provider.parseWebhookEvent({}, {}, query);
      expect(event.eventType).toBe('WEBHOOK_VERIFIED');
      if (event.eventType === 'WEBHOOK_VERIFIED') {
        expect(event.data.challenge).toBe('challenge-code');
        expect(event.data.status).toBe('SUCCESS');
      } else {
        fail('Expected eventType to be WEBHOOK_VERIFIED');
      }
    });

    it('should parse PUBLICATION_CREATED event', async () => {
      const body = {
        event: 'publication_created',
        publicationId: 'pub-999',
        accountId: 'acc-999',
        content: 'Automation test!',
        mediaUrls: ['url-1']
      };

      const event = await provider.parseWebhookEvent(headers, body, {});
      expect(event.eventType).toBe('PUBLICATION_CREATED');
      if (event.eventType === 'PUBLICATION_CREATED') {
        expect(event.data.publicationId).toBe('pub-999');
        expect(event.data.content).toBe('Automation test!');
      } else {
        fail('Expected eventType to be PUBLICATION_CREATED');
      }
    });

    it('should parse PUBLICATION_UPDATED event', async () => {
      const body = {
        event: 'publication_updated',
        publicationId: 'pub-999',
        accountId: 'acc-999',
        status: 'PUBLISHED',
        metrics: { views: 100 }
      };

      const event = await provider.parseWebhookEvent(headers, body, {});
      expect(event.eventType).toBe('PUBLICATION_UPDATED');
      if (event.eventType === 'PUBLICATION_UPDATED') {
        expect(event.data.status).toBe('PUBLISHED');
        expect(event.data.metrics).toEqual({ views: 100 });
      } else {
        fail('Expected eventType to be PUBLICATION_UPDATED');
      }
    });

    it('should parse COMMENT_RECEIVED event', async () => {
      const body = {
        event: 'comment_received',
        commentId: 'comm-1',
        publicationId: 'pub-1',
        authorId: 'auth-1',
        authorName: 'Author 1',
        text: 'Super cool!'
      };

      const event = await provider.parseWebhookEvent(headers, body, {});
      expect(event.eventType).toBe('COMMENT_RECEIVED');
      if (event.eventType === 'COMMENT_RECEIVED') {
        expect(event.data.commentId).toBe('comm-1');
        expect(event.data.text).toBe('Super cool!');
      } else {
        fail('Expected eventType to be COMMENT_RECEIVED');
      }
    });

    it('should parse MESSAGE_RECEIVED event', async () => {
      const body = {
        event: 'message_received',
        messageId: 'msg-1',
        senderId: 'send-1',
        senderName: 'Sender 1',
        text: 'Hello!'
      };

      const event = await provider.parseWebhookEvent(headers, body, {});
      expect(event.eventType).toBe('MESSAGE_RECEIVED');
      if (event.eventType === 'MESSAGE_RECEIVED') {
        expect(event.data.messageId).toBe('msg-1');
        expect(event.data.text).toBe('Hello!');
      } else {
        fail('Expected eventType to be MESSAGE_RECEIVED');
      }
    });

    it('should parse REACTION_ADDED event', async () => {
      const body = {
        event: 'reaction_added',
        publicationId: 'pub-1',
        commentId: 'comm-1',
        reactorId: 'react-1',
        reactionType: 'LIKE'
      };

      const event = await provider.parseWebhookEvent(headers, body, {});
      expect(event.eventType).toBe('REACTION_ADDED');
      if (event.eventType === 'REACTION_ADDED') {
        expect(event.data.reactionType).toBe('LIKE');
        expect(event.data.commentId).toBe('comm-1');
      } else {
        fail('Expected eventType to be REACTION_ADDED');
      }
    });

    it('should throw error for unsupported raw event types', async () => {
      await expect(
        provider.parseWebhookEvent(headers, { event: 'unknown_event' }, {})
      ).rejects.toThrow('Unsupported event type: unknown_event');
    });
  });
});
