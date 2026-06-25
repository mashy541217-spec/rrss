import { MessagingProvider, SendMessageOptions, SendMediaOptions, Message, MediaMessage, Conversation, Participant, MessagingRateLimiter } from '@rrss-auto/messaging-sdk';
import { TelegramBotClient } from '../client/TelegramBotClient';

export class TelegramProvider implements MessagingProvider {
  readonly providerId = 'telegram';
  private client: TelegramBotClient | null = null;
  private readonly rateLimiter = new MessagingRateLimiter({ calls: 30, windowMs: 1000 }); // Telegram generic limit

  constructor(private readonly options?: { mock?: boolean }) {}

  public async authenticate(credentials: Record<string, any>): Promise<any> {
    const token = credentials.token || credentials.botToken;
    if (!token) throw new Error('Missing Telegram Bot Token');
    this.client = new TelegramBotClient(token, this.options);
    
    return this.rateLimiter.executeWithRetry(async () => {
      const me = await this.client!.getMe();
      if (!me.ok) throw new Error('Invalid Telegram Bot Token');
      return { token, botId: me.result.id, username: me.result.username };
    });
  }

  public async validateConnection(credentials: Record<string, any>): Promise<boolean> {
    try {
      const token = credentials.token || credentials.botToken;
      const client = new TelegramBotClient(token, this.options);
      const res = await client.getMe();
      return res.ok === true;
    } catch {
      return false;
    }
  }

  public async sendMessage(conversationId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const markup = options?.inlineKeyboard ? { inline_keyboard: options.inlineKeyboard.rows } : undefined;
      const res = await this.client!.sendMessage(conversationId, text, markup);
      
      return {
        id: String(res.result.message_id),
        conversationId,
        senderId: 'me',
        timestamp: new Date(),
        type: 'TEXT',
        text
      } as any;
    });
  }

  public async editMessage(conversationId: string, messageId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const res = await this.client!.editMessageText(conversationId, Number(messageId), text);
      return {
        id: messageId,
        conversationId,
        senderId: 'me',
        timestamp: new Date(),
        type: 'TEXT',
        text
      } as any;
    });
  }

  public async deleteMessage(conversationId: string, messageId: string, credentials?: Record<string, any>): Promise<boolean> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const res = await this.client!.deleteMessage(conversationId, Number(messageId));
      return res.ok;
    });
  }

  public async sendMedia(conversationId: string, mediaUrl: string, type: MediaMessage['mediaType'], options?: SendMediaOptions, credentials?: Record<string, any>): Promise<MediaMessage> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      let res;
      if (type === 'PHOTO') {
        res = await this.client!.sendPhoto(conversationId, mediaUrl, options?.caption);
      } else {
        throw new Error(`Media type ${type} not fully mapped in mock yet`);
      }
      
      return {
        id: String(res.result.message_id),
        conversationId,
        senderId: 'me',
        timestamp: new Date(),
        type: 'MEDIA',
        mediaType: type,
        mediaUrl,
        caption: options?.caption
      } as MediaMessage;
    });
  }

  public async getConversations(credentials?: Record<string, any>): Promise<Conversation[]> {
    return []; // Usually bots do not enumerate all conversations in Telegram natively without stored state
  }

  public async getParticipants(conversationId: string, credentials?: Record<string, any>): Promise<Participant[]> {
    return [];
  }

  public async pinMessage(conversationId: string, messageId: string, credentials?: Record<string, any>): Promise<boolean> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      const res = await this.client!.pinChatMessage(conversationId, Number(messageId));
      return res.ok;
    });
  }

  public async reactToMessage(conversationId: string, messageId: string, emoji: string, credentials?: Record<string, any>): Promise<boolean> {
    return true; // Simple mock, Telegram uses setMessageReaction
  }

  private ensureClient(credentials?: Record<string, any>) {
    const token = credentials?.token || credentials?.botToken;
    if (!this.client && token) {
      this.client = new TelegramBotClient(token, this.options);
    }
    if (!this.client) throw new Error('TelegramProvider not authenticated');
  }
}
