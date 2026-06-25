import { DiscordPlugin } from '../plugin/DiscordPlugin';
import { DiscordWebhookProcessor } from '../webhooks/DiscordWebhookProcessor';

describe('Discord Provider Plugin', () => {
  let plugin: DiscordPlugin;
  let webhookProcessor: DiscordWebhookProcessor;
  const mockConfig = { settings: {}, credentials: { botToken: 'mock-token' } };
  const mockContext: any = {};

  beforeEach(() => {
    plugin = new DiscordPlugin({ mock: true });
    webhookProcessor = new DiscordWebhookProcessor('mock-public-key');
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
        conversationId: 'channel-123',
        text: 'Hello Discord'
      };

      const result = await plugin.executeAction('SendMessage', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should map embeds correctly', async () => {
      const params = {
        conversationId: 'channel-123',
        text: 'Hello Discord with Embeds',
        options: {
          metadata: {
            embeds: [{ title: 'Mock Embed' }]
          }
        }
      };

      const result = await plugin.executeAction('SendMessage', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
    });

    it('should map inlineKeyboard buttons correctly', async () => {
      const params = {
        conversationId: 'channel-123',
        text: 'Hello Discord with Buttons',
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
  });

  describe('Webhook Processor', () => {
    it('should parse application command interaction correctly', () => {
      const payload = {
        type: 2,
        channel_id: 'channel-123',
        member: { user: { id: 'user-123' } },
        data: { name: 'ping' }
      };

      const event: any = webhookProcessor.parseEvent({}, payload);
      expect(event).toBeDefined();
      expect(event.type).toBe('CommandReceived');
      expect(event.command.name).toBe('ping');
    });
  });
});
