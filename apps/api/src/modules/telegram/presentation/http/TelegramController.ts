import { Controller, Post, Get, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { TelegramPlugin } from '@rrss-auto/plugin-telegram';
import { TelegramWebhookProcessor } from '@rrss-auto/plugin-telegram';

@Controller('telegram')
export class TelegramController {
  private readonly plugin: TelegramPlugin;
  private readonly webhookProcessor: TelegramWebhookProcessor;

  constructor() {
    this.plugin = new TelegramPlugin({ mock: true });
    // In a real scenario, this would be injected or instantiated correctly
    // The processor doesn't depend on the options mock directly for pure functions
    this.webhookProcessor = new TelegramWebhookProcessor();
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  async connectAccount(@Body() dto: { botToken: string }) {
    const provider = (this.plugin as any).provider;
    const session = await provider.authenticate({ botToken: dto.botToken });
    
    return {
      message: 'Telegram bot connected successfully',
      session
    };
  }

  @Get('health')
  async checkHealth() {
    const health = await this.plugin.checkHealth({} as any, { credentials: { botToken: 'mock-token' } } as any);
    return health;
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Headers() headers: Record<string, string>, @Body() body: any) {
    const isValid = this.webhookProcessor.verifySignature(headers, body, 'my-secret');
    if (!isValid) {
      return { success: false, message: 'Invalid signature' };
    }

    const event = this.webhookProcessor.parseEvent(headers, body);
    if (event) {
      // Dispatch to event bus or execution engine
      return { success: true, eventType: event.type };
    }
    return { success: true, message: 'Unhandled event type' };
  }
}
