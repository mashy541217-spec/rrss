import { MessagingWebhookProcessor, MessagingEvent, MessageReceivedEvent, CallbackQueryReceivedEvent } from '@rrss-auto/messaging-sdk';

export class TelegramWebhookProcessor implements MessagingWebhookProcessor {
  public verifySignature(headers: Record<string, string>, body: any, secret: string): boolean {
    // Telegram sends a custom header `X-Telegram-Bot-Api-Secret-Token`
    const token = headers['x-telegram-bot-api-secret-token'];
    return token === secret;
  }

  public parseEvent(headers: Record<string, string>, body: any): MessagingEvent | null {
    if (body.message) {
      const msg = body.message;
      return {
        type: 'MessageReceived',
        providerId: 'telegram',
        timestamp: new Date(msg.date * 1000),
        message: {
          id: String(msg.message_id),
          conversationId: String(msg.chat.id),
          senderId: String(msg.from?.id),
          timestamp: new Date(msg.date * 1000),
          type: 'TEXT',
          text: msg.text || ''
        } as any
      } as MessageReceivedEvent;
    }

    if (body.callback_query) {
      const query = body.callback_query;
      return {
        type: 'CallbackQueryReceived',
        providerId: 'telegram',
        timestamp: new Date(), // Callback queries don't have a direct timestamp in the root usually
        query: {
          id: query.id,
          fromId: String(query.from.id),
          messageId: String(query.message?.message_id),
          payload: query.data
        }
      } as CallbackQueryReceivedEvent;
    }

    return null;
  }
}
