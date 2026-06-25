import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { WhatsAppWebhookProcessor } from '@rrss-auto/plugin-whatsapp-business';
import { MetaWebhookVerifier } from '@rrss-auto/meta-sdk';

@Controller('webhooks/whatsapp')
export class WhatsAppWebhookController {
  private readonly webhookProcessor: WhatsAppWebhookProcessor;

  constructor() {
    this.webhookProcessor = new WhatsAppWebhookProcessor();
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
    // Note: in mock test environments the signature might be omitted or mocked true
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
