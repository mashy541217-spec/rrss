import { MessengerPlugin } from '../plugin/MessengerPlugin';
import { MessengerWebhookProcessor } from '../webhooks/MessengerWebhookProcessor';
import { MetaWebhookVerifier } from '@rrss-auto/meta-sdk';

describe('Messenger Provider Plugin', () => {
  let plugin: MessengerPlugin;
  let webhookProcessor: MessengerWebhookProcessor;
  const mockConfig = { settings: {}, credentials: { pageToken: 'mock-token', pageId: '123' } };
  const mockContext: any = {};

  beforeEach(() => {
    plugin = new MessengerPlugin({ mock: true });
    const verifier = new MetaWebhookVerifier('app-secret', 'verify-token');
    webhookProcessor = new MessengerWebhookProcessor(verifier);
  });

  describe('Health Checks', () => {
    it('should pass health checks when token is valid', async () => {
      const status = await plugin.checkHealth(mockContext, mockConfig);
      expect(status.isHealthy).toBe(true);
      expect(status.message).toBe('ACTIVE');
    });
  });

  describe('Actions Execution', () => {
    it('should send text message successfully', async () => {
      const params = {
        conversationId: 'user-123',
        text: 'Hello Messenger'
      };

      const result = await plugin.executeAction('SendMessage', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send photo successfully', async () => {
      const params = {
        conversationId: 'user-123',
        mediaUrl: 'https://mock.url/image.jpg',
        mediaType: 'PHOTO'
      };

      const result = await plugin.executeAction('SendMedia', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });

  describe('Webhook Processor', () => {
    it('should parse text message received correctly', () => {
      const payload = {
        object: 'page',
        entry: [{
          messaging: [{
            sender: { id: 'user-123' },
            recipient: { id: 'page-123' },
            timestamp: 1620000000000,
            message: {
              mid: 'mid.123',
              text: 'Hello Page'
            }
          }]
        }]
      };

      const event: any = webhookProcessor.parseEvent({}, payload);
      expect(event).toBeDefined();
      expect(event.type).toBe('MessageReceived');
      expect(event.message.text).toBe('Hello Page');
      expect(event.message.type).toBe('TEXT');
    });
  });
});
