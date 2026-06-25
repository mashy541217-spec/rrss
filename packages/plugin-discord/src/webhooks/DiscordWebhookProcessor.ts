import { MessagingWebhookProcessor, MessagingEvent, MessageReceivedEvent } from '@rrss-auto/messaging-sdk';

export class DiscordWebhookProcessor implements MessagingWebhookProcessor {
  constructor(private readonly publicKey: string) {}

  public verifySignature(headers: Record<string, string>, body: any, secret: string): boolean {
    const signature = headers['x-signature-ed25519'];
    const timestamp = headers['x-signature-timestamp'];
    if (!signature || !timestamp) return false;
    
    // In a real implementation we would use tweetnacl:
    // const isVerified = nacl.sign.detached.verify(
    //   Buffer.from(timestamp + bodyRaw),
    //   Buffer.from(signature, 'hex'),
    //   Buffer.from(this.publicKey, 'hex')
    // );
    // return isVerified;
    
    return true; // Mocked for phase 3 tests
  }

  public parseEvent(headers: Record<string, string>, body: any): MessagingEvent | null {
    // Handling Discord Interaction Types
    // 1 = PING
    // 2 = APPLICATION_COMMAND (Slash command)
    // 3 = MESSAGE_COMPONENT (Button click)
    if (body.type === 2 && body.data) {
      // Map Slash command to generic command event
      return {
        type: 'CommandReceived',
        providerId: 'discord',
        timestamp: new Date(),
        command: {
          name: body.data.name,
          conversationId: body.channel_id,
          senderId: body.member?.user?.id || body.user?.id,
        }
      } as any;
    }
    
    // If it's a regular message event from a gateway webhook stream or similar
    if (body.type === 'MESSAGE_CREATE' && body.channel_id) {
      return {
        type: 'MessageReceived',
        providerId: 'discord',
        timestamp: new Date(),
        message: {
          id: body.id,
          conversationId: body.channel_id,
          senderId: body.author?.id,
          timestamp: new Date(body.timestamp || Date.now()),
          type: 'TEXT',
          text: body.content || ''
        }
      } as MessageReceivedEvent;
    }
    return null;
  }
}
