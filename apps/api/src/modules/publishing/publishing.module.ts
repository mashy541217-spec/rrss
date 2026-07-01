import { Module } from '@nestjs/common';
import { PublishingController } from './publishing.controller';
import { PublishingService } from './publishing.service';
import { MetaPublishingService } from './meta-publishing.service';
import { PublicationQueueService } from './publication-queue.service';
import { PublicationWorkerService } from './publication-worker.service';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';

@Module({
  controllers: [PublishingController],
  providers: [
    PublishingService,
    MetaPublishingService,
    PrismaService,
    PublicationQueueService,
    PublicationWorkerService,
  ],
  exports: [PublishingService, PublicationQueueService],
})
export class PublishingModule {}
