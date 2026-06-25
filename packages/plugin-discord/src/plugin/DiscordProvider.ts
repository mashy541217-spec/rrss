import { MessagingProvider, SendMessageOptions, SendMediaOptions, Message, MediaMessage, Conversation, Participant, MessagingRateLimiter } from '@rrss-auto/messaging-sdk';
import { DiscordBotClient } from '../client/DiscordBotClient';

export class DiscordProvider implements MessagingProvider {
  readonly providerId = 'discord';
  private client: DiscordBotClient | null = null;
  private readonly rateLimiter = new MessagingRateLimiter({ calls: 50, windowMs: 1000 }); // Discord global rate limit 50/s per bot

  constructor(private readonly options?: { mock?: boolean }) {}

  public async authenticate(credentials: Record<string, any>): Promise<any> {
    const token = credentials.token || credentials.botToken;
    if (!token) throw new Error('Missing token for Discord Provider');
    
    this.client = new DiscordBotClient(token, this.options);
    
    return this.rateLimiter.executeWithRetry(async () => {
      const me = await this.client!.getMe();
      return { token, botId: me.id };
    });
  }

  public async validateConnection(credentials: Record<string, any>): Promise<boolean> {
    try {
      const token = credentials.token || credentials.botToken;
      if (!token) return false;

      const client = new DiscordBotClient(token, this.options);
      await client.getMe();
      return true;
    } catch {
      return false;
    }
  }

  public async sendMessage(conversationId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      // Mapping InlineKeyboard to Discord Components (ActionRow)
      let components: any[] | undefined = undefined;
      if (options?.inlineKeyboard?.rows) {
        components = options.inlineKeyboard.rows.map(row => ({
          type: 1, // Action Row
          components: row.map(btn => ({
            type: 2, // Button
            style: btn.url ? 5 : 1, // 5=Link, 1=Primary
            label: btn.text,
            url: btn.url,
            custom_id: btn.url ? undefined : ((btn as any).payload || btn.text)
          }))
        }));
      }

      // Mapping standard Embed payloads if present in metadata
      let embeds: any[] | undefined = undefined;
      if ((options as any)?.metadata?.embeds) {
        embeds = (options as any).metadata.embeds;
      }

      const res = await this.client!.createMessage(conversationId, text, embeds, components);
      
      return {
        id: res.id,
        conversationId,
        senderId: 'bot',
        timestamp: new Date(),
        type: 'TEXT',
        text
      } as any;
    });
  }

  public async editMessage(conversationId: string, messageId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    throw new Error('Discord editMessage Mock not implemented yet');
  }

  public async deleteMessage(conversationId: string, messageId: string, credentials?: Record<string, any>): Promise<boolean> {
    throw new Error('Discord deleteMessage Mock not implemented yet');
  }

  public async sendMedia(conversationId: string, mediaUrl: string, type: MediaMessage['mediaType'], options?: SendMediaOptions, credentials?: Record<string, any>): Promise<MediaMessage> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      // In Discord, we either upload a file as multipart/form-data or send an embed with image.url
      // For mock purposes, we'll send it as content with the url
      const res = await this.client!.createMessage(conversationId, options?.caption || mediaUrl);
      
      return {
        id: res.id,
        conversationId,
        senderId: 'bot',
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
    throw new Error('Discord pinMessage Mock not implemented yet');
  }

  public async reactToMessage(conversationId: string, messageId: string, emoji: string, credentials?: Record<string, any>): Promise<boolean> {
    return true; 
  }

  private ensureClient(credentials?: Record<string, any>) {
    const token = credentials?.token || credentials?.botToken;
    if (!this.client && token) {
      this.client = new DiscordBotClient(token, this.options);
    }
    if (!this.client) throw new Error('DiscordProvider not authenticated');
  }
}
