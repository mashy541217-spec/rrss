import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { ResourcePool } from '../../../domain/aggregates/ResourcePool';
import { ValueObject } from '@rrss-auto/domain';
import { ResourcePoolMapper } from '../mappers/ResourcePoolMapper';
import { ResourcePool as PrismaResourcePool } from '@prisma/client';

import { IResourcePoolRepository } from '../../../domain/repositories/IResourcePoolRepository';
import { ResourceType } from '../../../domain/value-objects/ResourceType';

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

  async findByType(type: ResourceType): Promise<ResourcePool | null> {
    const model = await this.prisma.resourcePool.findUnique({
      where: { id: type.type }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async findAll(): Promise<ResourcePool[]> {
    const models = await this.prisma.resourcePool.findMany({
      where: { isDeleted: false }
    });
    return models.map(m => this.aggregateMapper.toDomain(m));
  }

  async findById(id: ValueObject<any>, scope?: TransactionScope): Promise<ResourcePool | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.resourcePool.findUnique({
      where: { id: (id as any).type ?? (id as any).props?.type ?? 'unknown' }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async save(pool: ResourcePool, scope?: TransactionScope): Promise<void> {
    if (scope) {
      await this.saveWithEvents(pool, scope, async (tx, model) => {
        await this.persistPool(tx, pool, model);
      });
    } else {
      await this.prisma.$transaction(async (tx) => {
        const localScope = new TransactionScope(tx);
        await this.saveWithEvents(pool, localScope, async (transactionClient, model) => {
          await this.persistPool(transactionClient, pool, model);
        });
      });
    }
  }

  private async persistPool(tx: any, pool: ResourcePool, model: any): Promise<void> {
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
  }
}
