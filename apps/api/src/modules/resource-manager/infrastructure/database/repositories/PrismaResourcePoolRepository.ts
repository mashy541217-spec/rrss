import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { ResourcePool } from '../../../domain/aggregates/ResourcePool';
import { ValueObject } from '@rrss-auto/domain';
import { ResourcePoolMapper } from '../mappers/ResourcePoolMapper';
import { ResourcePool as PrismaResourcePool } from '@prisma/client';

export interface IResourcePoolRepository {
  findById(id: ValueObject<any>, scope?: TransactionScope): Promise<ResourcePool | null>;
  save(pool: ResourcePool, scope: TransactionScope): Promise<void>;
}

@Injectable()
export class PrismaResourcePoolRepository
  extends BasePrismaRepository<ResourcePool, ValueObject<any>, PrismaResourcePool>
  implements IResourcePoolRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: ResourcePoolMapper
  ) {
    super(mapper, mapper);
  }

  async findById(id: ValueObject<any>, scope?: TransactionScope): Promise<ResourcePool | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.resourcePool.findUnique({
      where: { id: (id as any).type ?? (id as any).props?.type ?? 'unknown' }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async save(pool: ResourcePool, scope: TransactionScope): Promise<void> {
    await this.saveWithEvents(pool, scope, async (tx, model) => {
      const existing = await tx.resourcePool.findUnique({
        where: { id: model.id },
        select: { version: true }
      });

      const newVersion = model.version + 1;
      model.version = newVersion;
      (pool as any)['_version'] = newVersion;

      if (!existing) {
        await tx.resourcePool.create({ data: model });
      } else {
        if (existing.version !== model.version - 1) {
          throw new ConcurrencyException(`ResourcePool ${model.id} was modified by another transaction.`);
        }
        await tx.resourcePool.update({
          where: { id: model.id },
          data: model
        });
      }
    });
  }
}
