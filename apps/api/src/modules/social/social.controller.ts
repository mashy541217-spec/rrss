import { Controller, Get, Post, Body, Query, Res, Redirect, Req } from '@nestjs/common';
import { SocialService } from './social.service';
import { MetaDiscoveryService } from './meta-discovery.service';
import { Response, Request } from 'express';

@Controller('social')
export class SocialController {
  constructor(
    private readonly socialService: SocialService,
    private readonly metaDiscovery: MetaDiscoveryService
  ) {}

  @Post('oauth/start')
  async startOAuth(
    @Body('provider') provider: string, 
    @Body('businessId') businessId: string,
    @Res() res: Response
  ) {
    const authUrl = await this.socialService.generateAuthUrl(provider, businessId);
    return res.json({ url: authUrl });
  }

  @Get('oauth/callback')
  async oauthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {
    const success = await this.socialService.handleCallback(code, state);
    
    // Redirect back to frontend
    if (success) {
      return res.redirect('http://localhost:5175/social?success=true');
    } else {
      return res.redirect('http://localhost:5175/social?success=false');
    }
  }

  @Get('accounts')
  async getAccounts(@Query('businessId') businessId: string) {
    return this.socialService.getAccounts(businessId);
  }

  @Post('disconnect')
  async disconnect(@Body('credentialId') credentialId: string) {
    return this.socialService.disconnect(credentialId);
  }

  @Post('synchronize')
  async synchronize(@Body('credentialId') credentialId: string) {
    const success = await this.metaDiscovery.synchronize(credentialId);
    return { success };
  }

  @Get('status')
  async getStatus(@Query('businessId') businessId: string) {
    return this.socialService.getStatus(businessId);
  }
}
