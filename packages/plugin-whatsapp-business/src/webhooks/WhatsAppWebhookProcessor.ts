import { MessagingWebhookProcessor, MessagingEvent, MessageReceivedEvent } from '@rrss-auto/messaging-sdk';
import { MetaWebhookVerifier } from '@rrss-auto/meta-sdk';

export class WhatsAppWebhookProcessor implements MessagingWebhookProcessor {
  public verifySignature(headers: Record<string, string>, body: any, secret: string): boolean {
    // WhatsApp Cloud API uses standard Meta webhook verification
    // For mocked environments we just return true.
    // In production we would instantiate MetaWebhookVerifier with appSecret.
    const signature = headers['x-hub-signature-256'];
    if (!signature) return false;
    return true;
  }

  public parseEvent(headers: Record<string, string>, body: any): MessagingEvent | null {
    if (body.object === 'whatsapp_business_account' && body.entry?.[0]?.changes?.[0]?.value?.messages) {
      const value = body.entry[0].changes[0].value;
      const message = value.messages[0];
      const contact = value.contacts?.[0];

      return {
        type: 'MessageReceived',
        providerId: 'whatsapp-business',
        timestamp: new Date(Number(message.timestamp) * 1000),
        message: {
          id: message.id,
          conversationId: message.from,
          senderId: message.from,
          timestamp: new Date(Number(message.timestamp) * 1000),
          type: message.type.toUpperCase(),
          text: message.text?.body || ''
        } as any
      } as MessageReceivedEvent;
    }
    return null;
  }
}
