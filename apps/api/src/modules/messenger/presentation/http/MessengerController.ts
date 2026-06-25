import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MessengerPlugin } from '@rrss-auto/plugin-messenger';

@Controller('messenger')
export class MessengerController {
  private readonly plugin: MessengerPlugin;

  constructor() {
    this.plugin = new MessengerPlugin({ mock: true });
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  async connectAccount(@Body() dto: { pageToken: string; pageId: string }) {
    const provider = (this.plugin as any).provider;
    const session = await provider.authenticate({ pageToken: dto.pageToken, pageId: dto.pageId });
    
    return {
      message: 'Messenger account connected successfully',
      session
    };
  }

  @Get('health')
  async checkHealth() {
    const health = await this.plugin.checkHealth({} as any, { credentials: { pageToken: 'mock-token', pageId: '123' } } as any);
    return health;
  }
}
