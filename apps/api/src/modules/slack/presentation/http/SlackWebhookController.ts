import { Controller, Post, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { SlackWebhookProcessor } from '@rrss-auto/plugin-slack';

@Controller('webhooks/slack')
export class SlackWebhookController {
  private readonly webhookProcessor: SlackWebhookProcessor;

  constructor() {
    this.webhookProcessor = new SlackWebhookProcessor('mock-signing-secret');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Headers() headers: Record<string, string>, @Body() body: any) {
    // Slack requires returning challenge immediately during setup
    if (body.type === 'url_verification') {
      return { challenge: body.challenge };
    }

    const isValid = this.webhookProcessor.verifySignature(headers, JSON.stringify(body), 'unused');
    if (!isValid) {
      return { success: false, message: 'Invalid signature' }; 
    }

    const event = this.webhookProcessor.parseEvent(headers, body);
    if (event) {
      return { success: true, eventType: event.type };
    }
    return { success: true, message: 'Unhandled event type' };
  }
}
