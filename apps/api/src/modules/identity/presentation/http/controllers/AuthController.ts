import {
  Controller, Post, Get, Body, Headers, HttpCode, HttpStatus,
  UnauthorizedException, Inject,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserDto } from '../dto/LoginUserDto';
import { LoginUserCommand } from '../../../application/use-cases/LoginUser/LoginUserCommand';
import { LoginResult } from '../../../application/use-cases/LoginUser/LoginUserUseCase';
import { JwtService } from '../../../infrastructure/auth/JwtService';
import { ILogger } from '@rrss-auto/logger';
import { VerificationService } from '../../../application/services/VerificationService';

/**
 * Auth Controller — handles session operations.
 *
 * POST /auth/login      → validates credentials, returns JWT + user profile
 * GET  /auth/me         → decodes Bearer token, returns current user identity
 * POST /auth/verify     → for Alpha: any 6-digit code activates the account
 *
 * Design decision for Alpha:
 *  - Email verification uses an in-memory code store (no SMTP required).
 *  - The verification code is returned in the signup response so the frontend
 *    can display it to the user without any email infrastructure.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
    @Inject('ILogger') private readonly logger: ILogger,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto): Promise<LoginResult> {
    this.logger.info(`Login attempt: ${dto.email}`);
    const command = new LoginUserCommand(dto.email, dto.password);
    return this.commandBus.execute<LoginUserCommand, LoginResult>(command);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getCurrentUser(@Headers('authorization') authHeader: string) {
    try {
      const claims = this.jwtService.extractFromHeader(authHeader);
      return {
        userId: claims['sub'],
        email: claims['email'],
        displayName: claims['displayName'],
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }

  /**
   * Alpha verification flow:
   * 1. Frontend calls POST /users to register → backend stores pendingVerification user
   * 2. Backend returns userId + a verification code (stored in memory)
   * 3. Frontend displays the code in a dialog
   * 4. User enters the code → POST /auth/verify → account becomes Active
   * 5. Frontend calls POST /auth/login to get JWT
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() body: { userId: string; code: string },
  ): Promise<{ success: boolean }> {
    const success = this.verificationService.verifyCode(body.userId, body.code);
    if (!success) {
      throw new UnauthorizedException('Invalid verification code');
    }
    return { success: true };
  }
}
