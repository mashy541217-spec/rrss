import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IdentityInfrastructureModule } from './infrastructure/IdentityInfrastructureModule';
import { IdentityController } from './presentation/http/controllers/IdentityController';
import { AuthController } from './presentation/http/controllers/AuthController';
import { RegisterUserUseCase } from './application/use-cases/RegisterUser/RegisterUserUseCase';
import { LoginUserUseCase } from './application/use-cases/LoginUser/LoginUserUseCase';
import { JwtService } from './infrastructure/auth/JwtService';
import { PasswordHashingService } from './infrastructure/auth/PasswordHashingService';
import { VerificationService } from './application/services/VerificationService';

@Module({
  imports: [IdentityInfrastructureModule, CqrsModule],
  controllers: [IdentityController, AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtService,
    PasswordHashingService,
    VerificationService,
  ],
  exports: [
    IdentityInfrastructureModule,
    JwtService,
    PasswordHashingService,
  ],
})
export class IdentityModule {}
