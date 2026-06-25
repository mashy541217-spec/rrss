import { WhatsAppBusinessPlugin } from '../plugin/WhatsAppBusinessPlugin';
import { WhatsAppWebhookProcessor } from '../webhooks/WhatsAppWebhookProcessor';

describe('WhatsApp Business Provider Plugin', () => {
  let plugin: WhatsAppBusinessPlugin;
  let webhookProcessor: WhatsAppWebhookProcessor;
  const mockConfig = { settings: {}, credentials: { accessToken: 'mock-token', phoneNumberId: '123' } };
  const mockContext: any = {};

  beforeEach(() => {
    plugin = new WhatsAppBusinessPlugin({ mock: true });
    webhookProcessor = new WhatsAppWebhookProcessor();
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
        conversationId: '15555555555',
        text: 'Hello WhatsApp'
      };

      const result = await plugin.executeAction('SendMessage', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send template message successfully', async () => {
      const params = {
        conversationId: '15555555555',
        text: '',
        options: {
          metadata: {
            template: { name: 'hello_world', language: 'en_US', components: [] }
          }
        }
      };

      const result = await plugin.executeAction('SendMessage', mockContext, mockConfig, params);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send photo successfully', async () => {
      const params = {
        conversationId: '15555555555',
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
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            value: {
              messages: [{
                from: '15555555555',
                id: 'wamid.HBgLMS...',
                timestamp: '1620000000',
                type: 'text',
                text: { body: 'Hello' }
              }]
            }
          }]
        }]
      };

      const event: any = webhookProcessor.parseEvent({}, payload);
      expect(event).toBeDefined();
      expect(event.type).toBe('MessageReceived');
      expect(event.message.text).toBe('Hello');
      expect(event.message.type).toBe('TEXT');
    });
  });
});
