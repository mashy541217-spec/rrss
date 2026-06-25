import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { MessengerWebhookProcessor } from '@rrss-auto/plugin-messenger';
import { MetaWebhookVerifier } from '@rrss-auto/meta-sdk';

@Controller('webhooks/messenger')
export class MessengerWebhookController {
  private readonly webhookProcessor: MessengerWebhookProcessor;

  constructor() {
    const verifier = new MetaWebhookVerifier('app-secret', 'my-secret');
    this.webhookProcessor = new MessengerWebhookProcessor(verifier);
  }

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    if (mode === 'subscribe' && token === 'my-secret') {
      return challenge;
    }
    return 'Forbidden';
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Headers() headers: Record<string, string>, @Body() body: any) {
    const isValid = this.webhookProcessor.verifySignature(headers, body, 'my-secret');
    if (!isValid && headers['x-hub-signature-256']) {
      return { success: false, message: 'Invalid signature' };
    }

    const event = this.webhookProcessor.parseEvent(headers, body);
    if (event) {
      return { success: true, eventType: event.type };
    }
    return { success: true, message: 'Unhandled event type' };
  }
}
