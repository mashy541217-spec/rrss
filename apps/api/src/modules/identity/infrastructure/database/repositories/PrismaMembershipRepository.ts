import { Injectable } from '@nestjs/common';
import { Membership as PrismaMembership } from '@prisma/client';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { Membership } from '../../../domain/aggregates/Membership';
import { MembershipId } from '../../../domain/value-objects/MembershipId';
import { UserId } from '../../../domain/value-objects/UserId';
import { WorkspaceRef } from '../../../domain/value-objects/WorkspaceRef';
import { IMembershipRepository } from '../../../domain/repositories/IMembershipRepository';
import { MembershipMapper } from '../mappers/MembershipMapper';
import { ConcurrencyException } from '../../../../../infrastructure/database/traits/OptimisticLock';

@Injectable()
export class PrismaMembershipRepository 
  extends BasePrismaRepository<Membership, MembershipId, PrismaMembership> 
  implements IMembershipRepository 
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: MembershipMapper
  ) {
    super(mapper, mapper);
  }

  async save(membership: Membership): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const scope = new TransactionScope(tx);
      
      await this.saveWithEvents(membership, scope, async (transactionClient, model) => {
        const existing = await transactionClient.membership.findUnique({
          where: { id: model.id }
        });

        if (!existing) {
          await transactionClient.membership.create({ data: model });
        } else {
          if (existing.version !== model.version) {
            throw new ConcurrencyException('Membership', model.id);
          }

          const dataToUpdate = {
            ...model,
            version: model.version + 1,
            updatedAt: new Date()
          };

          await transactionClient.membership.update({
            where: { id: model.id, version: model.version },
            data: dataToUpdate
          });
          
          (membership as any)['_version'] = dataToUpdate.version;
        }
      });
    });
  }

  async findById(id: MembershipId): Promise<Membership | null> {
    const model = await this.prisma.membership.findFirst({
      where: { 
        id: id.value,
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }

  async findByUserAndWorkspace(userId: UserId, workspaceRef: WorkspaceRef): Promise<Membership | null> {
    const model = await this.prisma.membership.findFirst({
      where: { 
        userId: userId.value,
        workspaceRef: workspaceRef.value,
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }

  async findAllByWorkspace(workspaceRef: WorkspaceRef): Promise<Membership[]> {
    const models = await this.prisma.membership.findMany({
      where: { 
        workspaceRef: workspaceRef.value,
        isDeleted: false 
      }
    });

    return models.map(model => this.aggregateMapper.toDomain(model));
  }
}
