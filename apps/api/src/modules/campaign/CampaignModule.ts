import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CampaignController } from './presentation/http/CampaignController';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { PrismaCampaignRepository } from './infrastructure/database/repositories/PrismaCampaignRepository';
import { CampaignMapper } from './infrastructure/database/mappers/CampaignMapper';

// Application Use Cases
import { CreateCampaignUseCase } from './application/use-cases/CreateCampaign/CreateCampaignUseCase';
import { ActivateCampaignUseCase } from './application/use-cases/ActivateCampaign/ActivateCampaignUseCase';
import { PauseCampaignUseCase } from './application/use-cases/PauseCampaign/PauseCampaignUseCase';
import { CompleteCampaignUseCase } from './application/use-cases/CompleteCampaign/CompleteCampaignUseCase';
import { ArchiveCampaignUseCase } from './application/use-cases/ArchiveCampaign/ArchiveCampaignUseCase';
import { AttachContentUseCase } from './application/use-cases/AttachContent/AttachContentUseCase';
import { DetachContentUseCase } from './application/use-cases/DetachContent/DetachContentUseCase';
import { AddChannelUseCase } from './application/use-cases/AddChannel/AddChannelUseCase';
import { RemoveChannelUseCase } from './application/use-cases/RemoveChannel/RemoveChannelUseCase';
import { ConfigureBudgetUseCase } from './application/use-cases/ConfigureBudget/ConfigureBudgetUseCase';
import { ScheduleCampaignUseCase } from './application/use-cases/ScheduleCampaign/ScheduleCampaignUseCase';
import { UpdateAudienceUseCase } from './application/use-cases/UpdateAudience/UpdateAudienceUseCase';
import { UpdateStrategyUseCase } from './application/use-cases/UpdateStrategy/UpdateStrategyUseCase';
import { GeneratePublicationUseCase } from './application/use-cases/GeneratePublication/GeneratePublicationUseCase';

const CommandHandlers = [
  CreateCampaignUseCase,
  ActivateCampaignUseCase,
  PauseCampaignUseCase,
  CompleteCampaignUseCase,
  ArchiveCampaignUseCase,
  AttachContentUseCase,
  DetachContentUseCase,
  AddChannelUseCase,
  RemoveChannelUseCase,
  ConfigureBudgetUseCase,
  ScheduleCampaignUseCase,
  UpdateAudienceUseCase,
  UpdateStrategyUseCase,
  GeneratePublicationUseCase,
];

@Module({
  imports: [CqrsModule],
  controllers: [CampaignController],
  providers: [
    ...CommandHandlers,
    PrismaService,
    CampaignMapper,
    {
      provide: 'ICampaignRepository',
      useClass: PrismaCampaignRepository,
    },
  ],
  exports: ['ICampaignRepository'],
})
export class CampaignModule {}
