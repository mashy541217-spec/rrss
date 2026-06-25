import { MessagingProvider, SendMessageOptions, SendMediaOptions, Message, MediaMessage, Conversation, Participant, MessagingRateLimiter } from '@rrss-auto/messaging-sdk';
import { SlackBotClient } from '../client/SlackBotClient';

export class SlackProvider implements MessagingProvider {
  readonly providerId = 'slack';
  private client: SlackBotClient | null = null;
  private readonly rateLimiter = new MessagingRateLimiter({ calls: 1, windowMs: 1000 }); // Slack general limits 1/sec

  constructor(private readonly options?: { mock?: boolean }) {}

  public async authenticate(credentials: Record<string, any>): Promise<any> {
    const token = credentials.token || credentials.botToken;
    if (!token) throw new Error('Missing token for Slack Provider');
    
    this.client = new SlackBotClient(token, this.options);
    
    return this.rateLimiter.executeWithRetry(async () => {
      const test = await this.client!.authTest();
      return { token, botId: test.bot_id, teamId: test.team_id };
    });
  }

  public async validateConnection(credentials: Record<string, any>): Promise<boolean> {
    try {
      const token = credentials.token || credentials.botToken;
      if (!token) return false;

      const client = new SlackBotClient(token, this.options);
      await client.authTest();
      return true;
    } catch {
      return false;
    }
  }

  public async sendMessage(conversationId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      // Mapping InlineKeyboard to Slack Block Kit (Actions Block)
      let blocks: any[] | undefined = undefined;
      
      // If raw blocks are passed, prioritize them
      if ((options as any)?.metadata?.blocks) {
        blocks = (options as any).metadata.blocks;
      } 
      // Otherwise map the generic keyboard to actions
      else if (options?.inlineKeyboard?.rows) {
        blocks = [
          {
            type: 'section',
            text: { type: 'mrkdwn', text }
          },
          {
            type: 'actions',
            elements: options.inlineKeyboard.rows.flatMap(row => row.map(btn => ({
              type: 'button',
              text: { type: 'plain_text', text: btn.text },
              url: btn.url,
              action_id: btn.url ? undefined : ((btn as any).payload || btn.text)
            })))
          }
        ];
      }

      // If blocks are generated, we usually want to clear the top-level text or let Slack handle fallback
      const sendText = blocks ? text : text; 

      const res = await this.client!.postMessage(conversationId, sendText, blocks);
      
      return {
        id: res.ts,
        conversationId,
        senderId: 'bot',
        timestamp: new Date(),
        type: 'TEXT',
        text
      } as any;
    });
  }

  public async editMessage(conversationId: string, messageId: string, text: string, options?: SendMessageOptions, credentials?: Record<string, any>): Promise<Message> {
    throw new Error('Slack editMessage Mock not implemented yet');
  }

  public async deleteMessage(conversationId: string, messageId: string, credentials?: Record<string, any>): Promise<boolean> {
    throw new Error('Slack deleteMessage Mock not implemented yet');
  }

  public async sendMedia(conversationId: string, mediaUrl: string, type: MediaMessage['mediaType'], options?: SendMediaOptions, credentials?: Record<string, any>): Promise<MediaMessage> {
    this.ensureClient(credentials);
    return this.rateLimiter.executeWithRetry(async () => {
      // Slack usually requires files.upload API or blocks with image_url
      const blocks = [{
        type: 'image',
        image_url: mediaUrl,
        alt_text: options?.caption || 'Image'
      }];
      const res = await this.client!.postMessage(conversationId, options?.caption || mediaUrl, blocks);
      
      return {
        id: res.ts,
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
    throw new Error('Slack pinMessage Mock not implemented yet');
  }

  public async reactToMessage(conversationId: string, messageId: string, emoji: string, credentials?: Record<string, any>): Promise<boolean> {
    return true; 
  }

  private ensureClient(credentials?: Record<string, any>) {
    const token = credentials?.token || credentials?.botToken;
    if (!this.client && token) {
      this.client = new SlackBotClient(token, this.options);
    }
    if (!this.client) throw new Error('SlackProvider not authenticated');
  }
}
