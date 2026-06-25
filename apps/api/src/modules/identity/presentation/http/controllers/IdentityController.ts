import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserDto } from '../dto/RegisterUserDto';
import { RegisterUserCommand } from '../../../application/use-cases/RegisterUser/RegisterUserCommand';
import { ILogger } from '@rrss-auto/logger';

@ApiTags('Users')
@Controller('users')
export class IdentityController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject('ILogger') private readonly logger: ILogger
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async registerUser(@Body() dto: RegisterUserDto): Promise<void> {
    this.logger.info(`Received request to register user: ${dto.email}`);
    
    // Hash password in usecase or here. Usually in application service or earlier.
    // For now we just pass it as is, or assume application service hashes it.
    const command = new RegisterUserCommand(
      dto.email,
      dto.displayName,
      dto.password // should be hashed in use case
    );

    await this.commandBus.execute(command);
  }
}
