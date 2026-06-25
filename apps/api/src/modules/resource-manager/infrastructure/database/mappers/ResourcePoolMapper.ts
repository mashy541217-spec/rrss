import { Injectable } from '@nestjs/common';
import { ResourcePool as PrismaResourcePool } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { ResourcePool, ResourcePoolProps } from '../../../domain/aggregates/ResourcePool';
import { ResourceType } from '../../../domain/value-objects/ResourceType';
import { Capacity } from '../../../domain/value-objects/Capacity';
import { ValueObject } from '@rrss-auto/domain';

@Injectable()
export class ResourcePoolMapper
  implements
    AggregateMapper<ResourcePool, ValueObject<any>, PrismaResourcePool>,
    PersistenceMapper<ResourcePool, ValueObject<any>, PrismaResourcePool>
{
  toDomain(model: PrismaResourcePool): ResourcePool {
    const totalCapacityObj = model.totalCapacity as any;
    
    // Extracting domain entities properly
    const type = ResourceType.create(model.name);
    const totalCapacity = Capacity.create(totalCapacityObj.total ?? 0);

    const pool = (ResourcePool as any).create(type, totalCapacity);
    (pool as any).props.usedCapacity = typeof model.usedCapacity === 'number' ? model.usedCapacity : (model.usedCapacity as any)?.used ?? 0;
    (pool as any)['_version'] = model.version;
    pool.clearDomainEvents();
    return pool;
  }

  toPersistence(aggregate: ResourcePool): PrismaResourcePool {
    const version = (aggregate as any)['_version'] || 1;

    return {
      id: aggregate.type.type, // Using type string as ID
      name: aggregate.type.type,
      totalCapacity: { total: aggregate.totalCapacity.total } as any,
      usedCapacity: aggregate.usedCapacity as any,
      status: 'ACTIVE',
      version: version,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
