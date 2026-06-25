import { Controller, Post, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { DiscordWebhookProcessor } from '@rrss-auto/plugin-discord';

@Controller('webhooks/discord')
export class DiscordWebhookController {
  private readonly webhookProcessor: DiscordWebhookProcessor;

  constructor() {
    this.webhookProcessor = new DiscordWebhookProcessor('mock-public-key');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Headers() headers: Record<string, string>, @Body() body: any) {
    // Verify ed25519 signature
    const isValid = this.webhookProcessor.verifySignature(headers, body, 'unused');
    if (!isValid) {
      return { success: false, message: 'Invalid signature' }; // In real app, must throw 401 Unauthorized
    }

    // Discord requires returning { type: 1 } for PING (type 1)
    if (body.type === 1) {
      return { type: 1 };
    }

    const event = this.webhookProcessor.parseEvent(headers, body);
    if (event) {
      return { success: true, eventType: event.type };
    }
    return { success: true, message: 'Unhandled event type' };
  }
}
