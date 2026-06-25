import { MessagingProvider, SendMessageOptions, SendMediaOptions, Message, MediaMessage, Conversation, Participant, MessagingRateLimiter } from '@rrss-auto/messaging-sdk';
import { MessengerClient } from '../client/MessengerClient';

export class MessengerProvider implements MessagingProvider {
  readonly providerId = 'messenger';
  private client: MessengerClient | null = null;
  private readonly rateLimiter = new MessagingRateLimiter({ calls: 250, windowMs: 1000 }); // High limits for Messenger

  constructor(private readonly options?: { mock?: boolean }) {}

  public async authenticate(credentials: Record<string, any>): Promise<any> {
    const token = credentials.token || credentials.accessToken || credentials.pageToken;
    const pageId = credentials.pageId;
    if (!token || !pageId) throw new Error('Missing token or pageId for Messenger');
    
    this.client = new MessengerClient(token, pageId, this.options);
    
    return this.rateLimiter.executeWithRetry(async () => {
      const profile = await this.client!.getPageProfile();
      return { token, pageId, profileId: profile.id || pageId };
    });
  }

  public async validateConnection(credentials: Record<string, any>): Promise<boolean> {
    try {
      const token = credentials.token || credentials.accessToken || credentials.pageToken;
      const pageId = credentials.pageId;
      if (!token || !pageId) return false;

      const client = new MessengerClient(token, pageId, this.options);
      await client.getPageProfile();
      return true;
    } catch {
      return false;
    }
  }

  public async sendMessage(conversationId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      // Map inlineKeyboard to Messenger quick_replies if applicable
      let quickReplies: any[] | undefined = undefined;
      if (options?.inlineKeyboard?.rows) {
        quickReplies = options.inlineKeyboard.rows.flatMap(row => row.map(btn => ({
          content_type: 'text',
          title: btn.text,
          payload: (btn as any).payload || btn.url || btn.text
        })));
      }

      const res = await this.client!.sendTextMessage(conversationId, text, quickReplies);
      
      return {
        id: res.message_id || `msg-${Date.now()}`,
        conversationId,
        senderId: 'page',
        timestamp: new Date(),
        type: 'TEXT',
        text
      } as any;
    });
  }

  public async editMessage(conversationId: string, messageId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    throw new Error('Messenger API does not natively support editing sent messages');
  }

  public async deleteMessage(conversationId: string, messageId: string, credentials?: Record<string, any>): Promise<boolean> {
    throw new Error('Messenger API does not natively support deleting sent messages');
  }

  public async sendMedia(conversationId: string, mediaUrl: string, type: MediaMessage['mediaType'], options?: SendMediaOptions, credentials?: Record<string, any>): Promise<MediaMessage> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const mappedType = type === 'DOCUMENT' ? 'file' : type.toLowerCase() as any; 
      const res = await this.client!.sendMediaMessage(conversationId, mappedType, mediaUrl);
      
      return {
        id: res.message_id || `media-${Date.now()}`,
        conversationId,
        senderId: 'page',
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
    throw new Error('Messenger API does not support pinning messages');
  }

  public async reactToMessage(conversationId: string, messageId: string, emoji: string, credentials?: Record<string, any>): Promise<boolean> {
    return true; 
  }

  private ensureClient(credentials?: Record<string, any>) {
    const token = credentials?.token || credentials?.accessToken || credentials?.pageToken;
    const pageId = credentials?.pageId;
    if (!this.client && token && pageId) {
      this.client = new MessengerClient(token, pageId, this.options);
    }
    if (!this.client) throw new Error('MessengerProvider not authenticated');
  }
}
