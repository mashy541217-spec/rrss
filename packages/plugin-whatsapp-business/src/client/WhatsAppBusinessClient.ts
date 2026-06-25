import { MetaBaseClient } from '@rrss-auto/meta-sdk';

export class WhatsAppBusinessClient {
  private baseClient: MetaBaseClient;

  constructor(private readonly token: string, private readonly phoneNumberId: string, private readonly options?: { mock?: boolean }) {
    this.baseClient = new MetaBaseClient(token, options);
  }

  public async getBusinessProfile(): Promise<any> {
    return this.baseClient.get(`${this.phoneNumberId}/whatsapp_business_profile`);
  }

  public async sendTextMessage(to: string, text: string): Promise<any> {
    return this.baseClient.post(`${this.phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: text }
    });
  }

  public async sendMediaMessage(to: string, type: 'image' | 'video' | 'audio' | 'document', mediaUrl: string, caption?: string): Promise<any> {
    const payload: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type
    };
    payload[type] = { link: mediaUrl };
    if (caption) payload[type].caption = caption;
    
    return this.baseClient.post(`${this.phoneNumberId}/messages`, payload);
  }

  public async sendTemplateMessage(to: string, templateName: string, languageCode: string, components: any[] = []): Promise<any> {
    return this.baseClient.post(`${this.phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components
      }
    });
  }
}
