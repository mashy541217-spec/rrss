import { SlackPlugin } from '../plugin/SlackPlugin';
import { SlackWebhookProcessor } from '../webhooks/SlackWebhookProcessor';

describe('Slack Provider Plugin', () => {
  let plugin: SlackPlugin;
  let webhookProcessor: SlackWebhookProcessor;
  const mockConfig = { settings: {}, credentials: { botToken: 'xoxb-mock-token' } };
  const mockContext: any = {};

  beforeEach(() => {
    plugin = new SlackPlugin({ mock: true });
    webhookProcessor = new SlackWebhookProcessor('mock-signing-secret');
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
        conversationId: 'C12345',
        text: 'Hello Slack'
      };

      const result = await plugin.executeAction('SendMessage', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should map inlineKeyboard buttons to blocks correctly', async () => {
      const params = {
        conversationId: 'C12345',
        text: 'Hello Slack with Buttons',
        options: {
          inlineKeyboard: {
            rows: [
              [{ text: 'Click me', url: 'https://example.com' }]
            ]
          }
        }
      };

      const result = await plugin.executeAction('SendMessage', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
    });

    it('should send media wrapped in image blocks successfully', async () => {
      const params = {
        conversationId: 'C12345',
        mediaUrl: 'https://mock.url/image.jpg',
        mediaType: 'PHOTO',
        options: { caption: 'Test Image' }
      };

      const result = await plugin.executeAction('SendMedia', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });

  describe('Webhook Processor', () => {
    it('should parse message event correctly', () => {
      const payload = {
        type: 'event_callback',
        event: {
          type: 'message',
          channel: 'C12345',
          user: 'U12345',
          text: 'Hello bot',
          ts: '1620000000.000100'
        }
      };

      const event: any = webhookProcessor.parseEvent({}, payload);
      expect(event).toBeDefined();
      expect(event.type).toBe('MessageReceived');
      expect(event.message.text).toBe('Hello bot');
      expect(event.message.conversationId).toBe('C12345');
    });
  });
});
