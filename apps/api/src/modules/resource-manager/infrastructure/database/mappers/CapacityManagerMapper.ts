import { Injectable } from '@nestjs/common';
import { CapacityManager as PrismaCapacityManager } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { CapacityManager } from '../../../domain/aggregates/CapacityManager';
import { ValueObject } from '@rrss-auto/domain';

@Injectable()
export class CapacityManagerMapper
  implements
    AggregateMapper<CapacityManager, ValueObject<any>, PrismaCapacityManager>,
    PersistenceMapper<CapacityManager, ValueObject<any>, PrismaCapacityManager>
{
  toDomain(model: PrismaCapacityManager): CapacityManager {
    const manager = (CapacityManager as any).create(); // simplified creation
    (manager as any).props.globalLimits = model.globalLimits;
    (manager as any).props.reservedLimits = model.reservedLimits;
    (manager as any)['_version'] = model.version;
    manager.clearDomainEvents();
    return manager;
  }

  toPersistence(aggregate: CapacityManager): PrismaCapacityManager {
    const version = (aggregate as any)['_version'] || 1;

    return {
      id: (aggregate.id as any).value ?? (aggregate.id as any).props?.value ?? 'capacity-manager-global',
      status: 'ACTIVE',
      globalLimits: (aggregate as any).props.globalLimits ?? {},
      reservedLimits: (aggregate as any).props.reservedLimits ?? {},
      version: version,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
