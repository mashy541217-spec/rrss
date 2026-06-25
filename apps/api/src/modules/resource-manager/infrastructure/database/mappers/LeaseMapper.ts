import { Injectable } from '@nestjs/common';
import { ResourceLease as PrismaResourceLease } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { ResourceLease } from '../../../domain/aggregates/ResourceLease';
import { LeaseId } from '../../../domain/value-objects/LeaseId';
import { ResourceId } from '../../../domain/value-objects/ResourceId';
import { LeaseStatus } from '../../../domain/enums/LeaseStatus';

@Injectable()
export class LeaseMapper
  implements
    AggregateMapper<ResourceLease, LeaseId, PrismaResourceLease>,
    PersistenceMapper<ResourceLease, LeaseId, PrismaResourceLease>
{
  toDomain(model: PrismaResourceLease): ResourceLease {
    const durationSeconds = (model.expiresAt.getTime() - model.grantedAt.getTime()) / 1000;
    
    // We map workerId to executionId and poolId to resourceId because of schema mappings
    const lease = (ResourceLease as any).create(
      ResourceId.create(model.poolId),
      model.workerId, 
      durationSeconds,
      LeaseId.create(model.id)
    );
    
    (lease as any).props.status = model.status as LeaseStatus;
    (lease as any).props.createdAt = model.grantedAt;
    (lease as any)['_version'] = model.version;
    lease.clearDomainEvents();
    return lease;
  }

  toPersistence(aggregate: ResourceLease): PrismaResourceLease {
    const version = (aggregate as any)['_version'] || 1;

    return {
      id: aggregate.id.value,
      workerId: aggregate.executionId,
      poolId: aggregate.resourceId.value,
      resources: {} as any,
      status: aggregate.status,
      grantedAt: aggregate.createdAt,
      expiresAt: aggregate.expiresAt,
      version: version,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
