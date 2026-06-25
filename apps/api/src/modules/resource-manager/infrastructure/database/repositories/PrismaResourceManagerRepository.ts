import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { ConcurrencyException } from '../../../../../infrastructure/database/exceptions/ConcurrencyException';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { CapacityManager } from '../../../domain/aggregates/CapacityManager';
import { ValueObject } from '@rrss-auto/domain';
import { CapacityManagerMapper } from '../mappers/CapacityManagerMapper';
import { CapacityManager as PrismaCapacityManager } from '@prisma/client';

export interface IResourceManagerRepository {
  findById(id: ValueObject<any>, scope?: TransactionScope): Promise<CapacityManager | null>;
  save(manager: CapacityManager, scope: TransactionScope): Promise<void>;
}

@Injectable()
export class PrismaResourceManagerRepository
  extends BasePrismaRepository<CapacityManager, ValueObject<any>, PrismaCapacityManager>
  implements IResourceManagerRepository
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: CapacityManagerMapper
  ) {
    super(mapper, mapper);
  }

  async findById(id: ValueObject<any>, scope?: TransactionScope): Promise<CapacityManager | null> {
    const client = scope ? scope.client : this.prisma;
    
    const model = await client.capacityManager.findUnique({
      where: { id: (id as any).value ?? (id as any).props?.value ?? 'capacity-manager-global' }
    });

    if (!model || model.isDeleted) return null;

    return this.aggregateMapper.toDomain(model);
  }

  async save(manager: CapacityManager, scope: TransactionScope): Promise<void> {
    await this.saveWithEvents(manager, scope, async (tx, model) => {
      const existing = await tx.capacityManager.findUnique({
        where: { id: model.id },
        select: { version: true }
      });

      const newVersion = model.version + 1;
      model.version = newVersion;
      (manager as any)['_version'] = newVersion;

      if (!existing) {
        await tx.capacityManager.create({ data: model });
      } else {
        if (existing.version !== model.version - 1) {
          throw new ConcurrencyException(`CapacityManager ${model.id} was modified by another transaction.`);
        }
        await tx.capacityManager.update({
          where: { id: model.id },
          data: model
        });
      }
    });
  }
}
