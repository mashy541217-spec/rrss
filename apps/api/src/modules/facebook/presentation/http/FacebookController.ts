import { Controller, Post, Get, Body, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { FacebookPlugin } from '@rrss-auto/plugin-facebook';
import { ConnectAccountDto } from './dtos/ConnectAccountDto';
import { ValidateConnectionDto } from './dtos/ValidateConnectionDto';
import { RefreshTokenDto } from './dtos/RefreshTokenDto';

@Controller('facebook')
export class FacebookController {
  private readonly plugin: FacebookPlugin;

  constructor() {
    this.plugin = new FacebookPlugin({ mock: true });
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  async connectAccount(@Body() dto: ConnectAccountDto) {
    const provider = (this.plugin as any).provider;
    const session = await provider.authenticate({ token: dto.token });
    const profile = await provider.getProfile(dto.accountId, { token: dto.token });
    
    return {
      message: 'Facebook account connected successfully',
      session,
      profile
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    const provider = (this.plugin as any).provider;
    const session = await provider.refreshToken(dto.token);
    return {
      message: 'Token refreshed',
      session
    };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateConnection(@Body() dto: ValidateConnectionDto) {
    const provider = (this.plugin as any).provider;
    const isValid = await provider.validateConnection({ token: dto.token });
    return {
      isValid
    };
  }

  @Get('pages/:accountId')
  async getPages(@Param('accountId') accountId: string, @Body('token') token: string) {
    const provider = (this.plugin as any).provider;
    const pages = await provider.getPages(accountId, { token });
    return {
      pages
    };
  }

  @Get('health')
  async checkHealth() {
    // Basic context/config for health check
    const health = await this.plugin.checkHealth({} as any, { credentials: { token: 'mock-token' } } as any);
    return health;
  }
}
