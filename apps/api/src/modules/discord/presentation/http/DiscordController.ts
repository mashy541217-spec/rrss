import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { DiscordPlugin } from '@rrss-auto/plugin-discord';

@Controller('discord')
export class DiscordController {
  private readonly plugin: DiscordPlugin;

  constructor() {
    this.plugin = new DiscordPlugin({ mock: true });
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  async connectAccount(@Body() dto: { botToken: string }) {
    const provider = (this.plugin as any).provider;
    const session = await provider.authenticate({ botToken: dto.botToken });
    
    return {
      message: 'Discord bot connected successfully',
      session
    };
  }

  @Get('health')
  async checkHealth() {
    const health = await this.plugin.checkHealth({} as any, { credentials: { botToken: 'mock-token' } } as any);
    return health;
  }
}
