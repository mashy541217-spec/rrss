import { MessagingEvent } from '../events/MessagingEvents';

export interface MessagingWebhookProcessor {
  verifySignature(headers: Record<string, string>, body: any, secret: string): boolean;
  parseEvent(headers: Record<string, string>, body: any): MessagingEvent | null;
}
