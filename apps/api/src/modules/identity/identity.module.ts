import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IdentityInfrastructureModule } from './infrastructure/IdentityInfrastructureModule';
import { IdentityController } from './presentation/http/controllers/IdentityController';
import { RegisterUserUseCase } from './application/use-cases/RegisterUser/RegisterUserUseCase';

@Module({
  imports: [IdentityInfrastructureModule, CqrsModule],
  controllers: [IdentityController],
  providers: [RegisterUserUseCase],
  exports: [IdentityInfrastructureModule],
})
export class IdentityModule {}
