import { TelegramPlugin } from '../plugin/TelegramPlugin';
import { TelegramWebhookProcessor } from '../webhooks/TelegramWebhookProcessor';

describe('Telegram Provider Plugin', () => {
  let plugin: TelegramPlugin;
  let webhookProcessor: TelegramWebhookProcessor;
  const mockConfig = { settings: {}, credentials: { botToken: 'mock-token' } };
  const mockContext: any = {};

  beforeEach(() => {
    plugin = new TelegramPlugin({ mock: true });
    webhookProcessor = new TelegramWebhookProcessor();
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
        conversationId: 'chat-123',
        text: 'Hello Telegram'
      };

      const result = await plugin.executeAction('SendMessage', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send photo successfully', async () => {
      const params = {
        conversationId: 'chat-123',
        mediaUrl: 'https://mock.url/image.jpg',
        mediaType: 'PHOTO'
      };

      const result = await plugin.executeAction('SendMedia', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });

  describe('Webhook Processor', () => {
    it('should verify correct secret', () => {
      const isValid = webhookProcessor.verifySignature(
        { 'x-telegram-bot-api-secret-token': 'secret123' },
        {},
        'secret123'
      );
      expect(isValid).toBe(true);
    });

    it('should parse message correctly', () => {
      const payload = {
        message: {
          message_id: 42,
          date: 1620000000,
          chat: { id: 123 },
          from: { id: 456 },
          text: 'Hello'
        }
      };

      const event: any = webhookProcessor.parseEvent({}, payload);
      expect(event.type).toBe('MessageReceived');
      expect(event.message.text).toBe('Hello');
    });
  });
});
