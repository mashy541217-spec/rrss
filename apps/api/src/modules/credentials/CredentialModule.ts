import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CredentialController } from './presentation/http/CredentialController';
import { CreateCredentialUseCase } from './application/use-cases/CreateCredential/CreateCredentialUseCase';
import { RotateCredentialUseCase } from './application/use-cases/RotateCredential/RotateCredentialUseCase';
import { RevokeCredentialUseCase } from './application/use-cases/RevokeCredential/RevokeCredentialUseCase';
import { UpdateCredentialMetadataUseCase } from './application/use-cases/UpdateCredentialMetadata/UpdateCredentialMetadataUseCase';
import { ReadCredentialUseCase } from './application/use-cases/ReadCredential/ReadCredentialUseCase';
import { PrismaCredentialRepository } from './infrastructure/database/repositories/PrismaCredentialRepository';
import { LocalEncryptionService } from './infrastructure/encryption/LocalEncryptionService';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService'; // Import PrismaService

const CommandHandlers = [
  CreateCredentialUseCase,
  RotateCredentialUseCase,
  RevokeCredentialUseCase,
  UpdateCredentialMetadataUseCase
];

const QueryHandlers = [
  ReadCredentialUseCase
];

@Module({
  imports: [CqrsModule],
  controllers: [CredentialController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    PrismaService, // Add PrismaService provider
    {
      provide: 'ICredentialRepository',
      useClass: PrismaCredentialRepository
    },
    {
      provide: 'IEncryptionService',
      useClass: LocalEncryptionService
    }
  ],
  exports: [
    'ICredentialRepository',
    'IEncryptionService'
  ]
})
export class CredentialModule {}
