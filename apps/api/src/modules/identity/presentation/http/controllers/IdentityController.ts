import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserDto } from '../dto/RegisterUserDto';
import { RegisterUserCommand } from '../../../application/use-cases/RegisterUser/RegisterUserCommand';
import { VerificationService } from '../../../application/services/VerificationService';
import { PasswordHashingService } from '../../../infrastructure/auth/PasswordHashingService';
import { ILogger } from '@rrss-auto/logger';

@ApiTags('Users')
@Controller('users')
export class IdentityController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly verificationService: VerificationService,
    @Inject('ILogger') private readonly logger: ILogger,
  ) {}

  /**
   * Register a new user.
   * Returns userId + a one-time verification code (Alpha: displayed on screen).
   * In production the code would be emailed — the response shape stays the same.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async registerUser(@Body() dto: RegisterUserDto): Promise<{ userId: string; verificationCode: string }> {
    this.logger.info(`Received registration request for: ${dto.email}`);

    // Hash password here — the domain layer must never receive a plain-text password
    const passwordHash = this.passwordHashingService.hash(dto.password);

    const command = new RegisterUserCommand(dto.email, dto.displayName, passwordHash);
    const userId = await this.commandBus.execute<RegisterUserCommand, string>(command);

    // Alpha: generate verification code and return it to the UI
    const verificationCode = this.verificationService.storeVerificationCode(userId);

    return { userId, verificationCode };
  }
}
