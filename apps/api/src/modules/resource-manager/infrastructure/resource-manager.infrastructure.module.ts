import { Module } from '@nestjs/common';
import { PrismaResourceManagerRepository } from './database/repositories/PrismaResourceManagerRepository';
import { PrismaResourcePoolRepository } from './database/repositories/PrismaResourcePoolRepository';
import { PrismaLeaseRepository } from './database/repositories/PrismaLeaseRepository';
import { CapacityManagerMapper } from './database/mappers/CapacityManagerMapper';
import { ResourcePoolMapper } from './database/mappers/ResourcePoolMapper';
import { LeaseMapper } from './database/mappers/LeaseMapper';

@Module({
  providers: [
    PrismaResourceManagerRepository,
    PrismaResourcePoolRepository,
    PrismaLeaseRepository,
    CapacityManagerMapper,
    ResourcePoolMapper,
    LeaseMapper,
  ],
  exports: [
    PrismaResourceManagerRepository,
    PrismaResourcePoolRepository,
    PrismaLeaseRepository,
  ]
})
export class ResourceManagerInfrastructureModule {}
