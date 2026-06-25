import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContentController, AssetController, PublicationProfileController } from './presentation/http/ContentController';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { PrismaContentRepository } from './infrastructure/database/repositories/PrismaContentRepository';
import { PrismaAssetRepository } from './infrastructure/database/repositories/PrismaAssetRepository';

// Application Use Cases
import { CreateContentUseCase } from './application/use-cases/CreateContent/CreateContentUseCase';
import { UploadMediaUseCase } from './application/use-cases/UploadMedia/UploadMediaUseCase';
import { ArchiveContentUseCase } from './application/use-cases/ArchiveContent/ArchiveContentUseCase';
import { AddLocalizationUseCase } from './application/use-cases/AddLocalization/AddLocalizationUseCase';
import { UpdateMetadataUseCase } from './application/use-cases/UpdateMetadata/UpdateMetadataUseCase';
import { DuplicateContentUseCase } from './application/use-cases/DuplicateContent/DuplicateContentUseCase';
import { GeneratePublicationProfileUseCase } from './application/use-cases/GeneratePublicationProfile/GeneratePublicationProfileUseCase';

const CommandHandlers = [
  CreateContentUseCase,
  UploadMediaUseCase,
  ArchiveContentUseCase,
  AddLocalizationUseCase,
  UpdateMetadataUseCase,
  DuplicateContentUseCase,
  GeneratePublicationProfileUseCase,
];

@Module({
  imports: [CqrsModule],
  controllers: [ContentController, AssetController, PublicationProfileController],
  providers: [
    ...CommandHandlers,
    PrismaService,
    {
      provide: 'IContentRepository',
      useClass: PrismaContentRepository,
    },
    {
      provide: 'IAssetRepository',
      useClass: PrismaAssetRepository,
    },
    {
      provide: 'IPublicationProfileRepository',
      // TODO: Implement PrismaPublicationProfileRepository in next iteration
      useValue: {
        save: async () => {},
        findById: async () => null,
      },
    },
  ],
  exports: ['IContentRepository', 'IAssetRepository'],
})
export class ContentModule {}
