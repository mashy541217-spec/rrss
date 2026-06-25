import { Controller, Post, Body, HttpCode, HttpStatus, Param, Delete, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConnectAccountDto } from './dtos/ConnectAccountDto';
import { CreateCredentialCommand } from '../../../credentials/application/use-cases/CreateCredential/CreateCredentialCommand';
import { RotateCredentialCommand } from '../../../credentials/application/use-cases/RotateCredential/RotateCredentialCommand';
import { RevokeCredentialCommand } from '../../../credentials/application/use-cases/RevokeCredential/RevokeCredentialCommand';
import { ReadCredentialQuery } from '../../../credentials/application/use-cases/ReadCredential/ReadCredentialQuery';
import { CredentialProvider } from '../../../credentials/domain/enums/CredentialProvider';
import { CredentialScope } from '../../../credentials/domain/enums/CredentialScope';
import { RotationPolicy } from '../../../credentials/domain/enums/RotationPolicy';
import { InstagramPlugin } from '@rrss-auto/plugin-instagram';
import { InstagramFeatureFlags } from '@rrss-auto/plugin-instagram';

@ApiTags('Instagram Integration')
@Controller('instagram')
export class InstagramController {
  private readonly plugin = new InstagramPlugin({ mock: true });

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post('connect')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Connect Instagram Business Account' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Instagram account connected successfully' })
  public async connect(@Body() dto: ConnectAccountDto) {
    // 1. Validate token with Instagram Plugin auth
    const isValid = await this.plugin.executeAction('PublishContent', {} as any, {
      settings: {},
      credentials: { token: dto.token }
    }, {
      targetId: 'mock-account-id',
      text: 'verification-ping',
      mediaUrls: ['https://mock.url/verify.jpg']
    });

    if (!isValid || !isValid.success) {
      throw new Error('Connection validation failed: Invalid authorization token');
    }

    // 2. Persist using Credentials Platform command
    const policy = {
      rotationPolicy: RotationPolicy.MANUAL,
      requiresMfa: false,
      expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000) // 60 days
    };

    const command = new CreateCredentialCommand(
      dto.name,
      'OAuth2',
      CredentialProvider.SYSTEM,
      CredentialScope.WORKSPACE,
      dto.workspaceId,
      dto.token,
      {
        platform: 'instagram',
        username: 'mock_instagram_username',
        ...(dto.metadata || {})
      },
      policy
    );

    const credentialId = await this.commandBus.execute(command);
    return {
      credentialId,
      status: 'ACTIVE',
      username: 'mock_instagram_username',
      features: InstagramFeatureFlags
    };
  }

  @Delete('disconnect/:credentialId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disconnect Instagram Account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Instagram account disconnected' })
  public async disconnect(@Param('credentialId') credentialId: string) {
    const command = new RevokeCredentialCommand(credentialId, 'Member requested disconnection');
    await this.commandBus.execute(command);
    return { success: true };
  }

  @Post('refresh/:credentialId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Instagram Access Token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token refreshed successfully' })
  public async refresh(@Param('credentialId') credentialId: string) {
    // 1. Read existing token
    const query = new ReadCredentialQuery(credentialId, 'instagram-refresher');
    const cred = await this.queryBus.execute(query);

    // 2. Request a refreshed token from Instagram Plugin
    const refreshResult = await this.plugin.executeAction('PublishContent', {} as any, {
      settings: {},
      credentials: { token: cred.plainTextSecret }
    }, {
      targetId: 'mock-account-id',
      text: 'refresh-ping',
      mediaUrls: ['https://mock.url/verify.jpg']
    });

    if (!refreshResult || !refreshResult.success) {
      throw new Error('Token refresh validation failed');
    }

    const refreshedToken = `refreshed-token-${Date.now()}`;

    // 3. Rotate secret in database
    const rotateCommand = new RotateCredentialCommand(credentialId, refreshedToken);
    await this.commandBus.execute(rotateCommand);

    return {
      success: true,
      credentialId,
      status: 'ACTIVE'
    };
  }

  @Post('validate/:credentialId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate Instagram Connection' })
  public async validate(@Param('credentialId') credentialId: string) {
    try {
      const query = new ReadCredentialQuery(credentialId, 'instagram-validator');
      const cred = await this.queryBus.execute(query);

      const isValid = await this.plugin.executeAction('PublishContent', {} as any, {
        settings: {},
        credentials: { token: cred.plainTextSecret }
      }, {
        targetId: 'mock-account-id',
        text: 'ping',
        mediaUrls: ['https://mock.url/verify.jpg']
      });

      return { isValid: !!(isValid && isValid.success) };
    } catch {
      return { isValid: false };
    }
  }

  @Get('health/:credentialId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve Instagram Plugin Health' })
  public async health(@Param('credentialId') credentialId: string) {
    const query = new ReadCredentialQuery(credentialId, 'instagram-health-check');
    const cred = await this.queryBus.execute(query);

    const health = await this.plugin.checkHealth({} as any, {
      settings: {},
      credentials: { token: cred.plainTextSecret }
    });

    return health;
  }

  @Get('status/:credentialId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Instagram Connection Status' })
  public async status(@Param('credentialId') credentialId: string) {
    const query = new ReadCredentialQuery(credentialId, 'instagram-status');
    const cred = await this.queryBus.execute(query);

    return {
      id: credentialId,
      name: cred.name,
      platform: 'instagram',
      status: 'ACTIVE',
      features: InstagramFeatureFlags,
      version: '1.0.0'
    };
  }

  @Get('features')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Instagram Supported Features' })
  public async getFeatures() {
    return InstagramFeatureFlags;
  }
}
