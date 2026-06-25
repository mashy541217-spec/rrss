import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { ResourceLease } from '../../../domain/aggregates/ResourceLease';
import { LeaseId } from '../../../domain/value-objects/LeaseId';
import { LeaseMapper } from '../mappers/LeaseMapper';
import { ResourceLease as PrismaResourceLease } from '@prisma/client';

import { IResourceLeaseRepository } from '../../../domain/repositories/IResourceLeaseRepository';

@Injectable()
export class PrismaLeaseRepository
  extends BasePrismaRepository<ResourceLease, LeaseId, PrismaResourceLease>
  implements IResourceLeaseRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: LeaseMapper
  ) {
    super(mapper, mapper);
  }

  async delete(id: LeaseId): Promise<void> {
    await this.prisma.resourceLease.update({
      where: { id: id.value },
      data: { isDeleted: true, deletedAt: new Date() }
    });
  }

  async findById(id: LeaseId, scope?: TransactionScope): Promise<ResourceLease | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.resourceLease.findUnique({
      where: { id: id.value }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async save(lease: ResourceLease, scope?: TransactionScope): Promise<void> {
    if (scope) {
      await this.saveWithEvents(lease, scope, async (tx, model) => {
        await this.persistLease(tx, lease, model);
      });
    } else {
      await this.prisma.$transaction(async (tx) => {
        const localScope = new TransactionScope(tx);
        await this.saveWithEvents(lease, localScope, async (transactionClient, model) => {
          await this.persistLease(transactionClient, lease, model);
        });
      });
    }
  }

  private async persistLease(tx: any, lease: ResourceLease, model: any): Promise<void> {
    const existing = await tx.resourceLease.findUnique({
      where: { id: model.id },
      select: { version: true }
    });

    const newVersion = model.version + 1;
    model.version = newVersion;
    (lease as any)['_version'] = newVersion;

    if (!existing) {
      await tx.resourceLease.create({ data: model });
    } else {
      if (existing.version !== model.version - 1) {
        throw new ConcurrencyException(`ResourceLease ${model.id} was modified by another transaction.`);
      }
      await tx.resourceLease.update({
        where: { id: model.id },
        data: model
      });
    }
  }
}
