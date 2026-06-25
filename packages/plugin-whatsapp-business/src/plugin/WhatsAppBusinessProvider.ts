import { MessagingProvider, SendMessageOptions, SendMediaOptions, Message, MediaMessage, Conversation, Participant, MessagingRateLimiter } from '@rrss-auto/messaging-sdk';
import { WhatsAppBusinessClient } from '../client/WhatsAppBusinessClient';

export class WhatsAppBusinessProvider implements MessagingProvider {
  readonly providerId = 'whatsapp-business';
  private client: WhatsAppBusinessClient | null = null;
  private readonly rateLimiter = new MessagingRateLimiter({ calls: 80, windowMs: 1000 }); // WhatsApp Business typical limit per tier

  constructor(private readonly options?: { mock?: boolean }) {}

  public async authenticate(credentials: Record<string, any>): Promise<any> {
    const token = credentials.token || credentials.accessToken;
    const phoneNumberId = credentials.phoneNumberId;
    if (!token || !phoneNumberId) throw new Error('Missing token or phoneNumberId for WhatsApp Business');
    
    this.client = new WhatsAppBusinessClient(token, phoneNumberId, this.options);
    
    return this.rateLimiter.executeWithRetry(async () => {
      const profile = await this.client!.getBusinessProfile();
      return { token, phoneNumberId, profileId: profile.data?.[0]?.id || phoneNumberId };
    });
  }

  public async validateConnection(credentials: Record<string, any>): Promise<boolean> {
    try {
      const token = credentials.token || credentials.accessToken;
      const phoneNumberId = credentials.phoneNumberId;
      if (!token || !phoneNumberId) return false;

      const client = new WhatsAppBusinessClient(token, phoneNumberId, this.options);
      await client.getBusinessProfile();
      return true;
    } catch {
      return false;
    }
  }

  public async sendMessage(conversationId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      // If template options are passed via metadata (custom extension of options)
      const template = (options as any)?.metadata?.template;
      let res;
      if (template) {
        res = await this.client!.sendTemplateMessage(conversationId, template.name, template.language, template.components);
      } else {
        res = await this.client!.sendTextMessage(conversationId, text);
      }
      
      const msgId = res.messages?.[0]?.id || `wa-msg-${Date.now()}`;
      return {
        id: msgId,
        conversationId,
        senderId: 'business-phone',
        timestamp: new Date(),
        type: 'TEXT',
        text
      } as any;
    });
  }

  public async editMessage(conversationId: string, messageId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    throw new Error('WhatsApp Cloud API does not natively support editing messages sent by business');
  }

  public async deleteMessage(conversationId: string, messageId: string, credentials?: Record<string, any>): Promise<boolean> {
    throw new Error('WhatsApp Cloud API does not natively support deleting messages sent by business');
  }

  public async sendMedia(conversationId: string, mediaUrl: string, type: MediaMessage['mediaType'], options?: SendMediaOptions, credentials?: Record<string, any>): Promise<MediaMessage> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const mappedType = type.toLowerCase() as any; // IMAGE -> image
      const res = await this.client!.sendMediaMessage(conversationId, mappedType, mediaUrl, options?.caption);
      
      return {
        id: res.messages?.[0]?.id || `wa-media-${Date.now()}`,
        conversationId,
        senderId: 'business-phone',
        timestamp: new Date(),
        type: 'MEDIA',
        mediaType: type,
        mediaUrl,
        caption: options?.caption
      } as MediaMessage;
    });
  }

  public async getConversations(credentials?: Record<string, any>): Promise<Conversation[]> {
    return [];
  }

  public async getParticipants(conversationId: string, credentials?: Record<string, any>): Promise<Participant[]> {
    return [];
  }

  public async pinMessage(conversationId: string, messageId: string, credentials?: Record<string, any>): Promise<boolean> {
    throw new Error('WhatsApp Cloud API does not support pinning messages via API');
  }

  public async reactToMessage(conversationId: string, messageId: string, emoji: string, credentials?: Record<string, any>): Promise<boolean> {
    return true; // Partially supported via specific graph calls, simplified for mock
  }

  private ensureClient(credentials?: Record<string, any>) {
    const token = credentials?.token || credentials?.accessToken;
    const phoneNumberId = credentials?.phoneNumberId;
    if (!this.client && token && phoneNumberId) {
      this.client = new WhatsAppBusinessClient(token, phoneNumberId, this.options);
    }
    if (!this.client) throw new Error('WhatsAppBusinessProvider not authenticated');
  }
}
