import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { MetaDiscoveryService } from './meta-discovery.service';

@Module({
  controllers: [SocialController],
  providers: [SocialService, PrismaService, MetaDiscoveryService],
})
export class SocialModule {}
