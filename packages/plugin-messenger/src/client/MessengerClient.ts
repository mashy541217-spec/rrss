import { MetaBaseClient } from '@rrss-auto/meta-sdk';

export class MessengerClient {
  private baseClient: MetaBaseClient;

  constructor(private readonly token: string, private readonly pageId: string, private readonly options?: { mock?: boolean }) {
    this.baseClient = new MetaBaseClient(token, options);
  }

  public async getPageProfile(): Promise<any> {
    return this.baseClient.get(`${this.pageId}`);
  }

  public async sendTextMessage(recipientId: string, text: string, quickReplies?: any[]): Promise<any> {
    const message: any = { text };
    if (quickReplies && quickReplies.length > 0) {
      message.quick_replies = quickReplies;
    }

    return this.baseClient.post(`${this.pageId}/messages`, {
      recipient: { id: recipientId },
      messaging_type: 'RESPONSE',
      message
    });
  }

  public async sendMediaMessage(recipientId: string, type: 'image' | 'video' | 'audio' | 'file', mediaUrl: string): Promise<any> {
    return this.baseClient.post(`${this.pageId}/messages`, {
      recipient: { id: recipientId },
      messaging_type: 'RESPONSE',
      message: {
        attachment: {
          type,
          payload: { url: mediaUrl, is_reusable: true }
        }
      }
    });
  }
}
