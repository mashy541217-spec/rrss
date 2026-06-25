import { FakeMessagingProvider } from '../fake/FakeMessagingProvider';
import { MessageBuilder } from '../fake/MessagingBuilders';
import { MessagingRateLimiter } from '../operations/MessagingRateLimiter';

describe('Messaging SDK Core', () => {
  describe('FakeMessagingProvider', () => {
    it('should authenticate successfully with valid token', async () => {
      const provider = new FakeMessagingProvider();
      const res = await provider.authenticate({ token: 'test-token' });
      expect(res.valid).toBe(true);
    });

    it('should throw error on missing token', async () => {
      const provider = new FakeMessagingProvider();
      await expect(provider.authenticate({})).rejects.toThrow('Unauthorized');
    });

    it('should send and store text messages', async () => {
      const provider = new FakeMessagingProvider();
      const msg = await provider.sendMessage('chat-1', 'Hello World');
      expect(msg.type).toBe('TEXT');
      expect(provider.messages.length).toBe(1);
    });
  });

  describe('MessagingBuilders', () => {
    it('should build text message', () => {
      const msg = new MessageBuilder().withText('Testing').withConversation('group-1').build();
      expect(msg.text).toBe('Testing');
      expect(msg.conversationId).toBe('group-1');
    });
  });

  describe('MessagingRateLimiter', () => {
    it('should execute successfully if no error', async () => {
      const limiter = new MessagingRateLimiter();
      const result = await limiter.executeWithRetry(async () => 'success');
      expect(result).toBe('success');
    });

    it('should throw immediately on non-rate limit errors', async () => {
      const limiter = new MessagingRateLimiter();
      await expect(limiter.executeWithRetry(async () => {
        throw new Error('Database Error');
      })).rejects.toThrow('Database Error');
    });
  });
});
