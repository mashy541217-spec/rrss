import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WhatsAppBusinessPlugin } from '@rrss-auto/plugin-whatsapp-business';

@Controller('whatsapp')
export class WhatsAppController {
  private readonly plugin: WhatsAppBusinessPlugin;

  constructor() {
    this.plugin = new WhatsAppBusinessPlugin({ mock: true });
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  async connectAccount(@Body() dto: { accessToken: string; phoneNumberId: string }) {
    const provider = (this.plugin as any).provider;
    const session = await provider.authenticate({ accessToken: dto.accessToken, phoneNumberId: dto.phoneNumberId });
    
    return {
      message: 'WhatsApp Business account connected successfully',
      session
    };
  }

  @Get('health')
  async checkHealth() {
    const health = await this.plugin.checkHealth({} as any, { credentials: { accessToken: 'mock-token', phoneNumberId: '123' } } as any);
    return health;
  }
}
