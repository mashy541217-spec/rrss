import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SlackPlugin } from '@rrss-auto/plugin-slack';

@Controller('slack')
export class SlackController {
  private readonly plugin: SlackPlugin;

  constructor() {
    this.plugin = new SlackPlugin({ mock: true });
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  async connectAccount(@Body() dto: { botToken: string }) {
    const provider = (this.plugin as any).provider;
    const session = await provider.authenticate({ botToken: dto.botToken });
    
    return {
      message: 'Slack bot connected successfully',
      session
    };
  }

  @Get('health')
  async checkHealth() {
    const health = await this.plugin.checkHealth({} as any, { credentials: { botToken: 'xoxb-mock' } } as any);
    return health;
  }
}
