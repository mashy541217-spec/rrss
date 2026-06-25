import { Injectable } from '@nestjs/common';
import { Invitation as PrismaInvitation } from '@prisma/client';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { Invitation } from '../../../domain/aggregates/Invitation';
import { InvitationId } from '../../../domain/value-objects/InvitationId';
import { Email } from '../../../domain/value-objects/Email';
import { WorkspaceRef } from '../../../domain/value-objects/WorkspaceRef';
import { IInvitationRepository } from '../../../domain/repositories/IInvitationRepository';
import { InvitationMapper } from '../mappers/InvitationMapper';
import { ConcurrencyException } from '../../../../../infrastructure/database/traits/OptimisticLock';

@Injectable()
export class PrismaInvitationRepository 
  extends BasePrismaRepository<Invitation, InvitationId, PrismaInvitation> 
  implements IInvitationRepository 
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: InvitationMapper
  ) {
    super(mapper, mapper);
  }

  async save(invitation: Invitation): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const scope = new TransactionScope(tx);
      
      await this.saveWithEvents(invitation, scope, async (transactionClient, model) => {
        const existing = await transactionClient.invitation.findUnique({
          where: { id: model.id }
        });

        if (!existing) {
          await transactionClient.invitation.create({ data: model });
        } else {
          if (existing.version !== model.version) {
            throw new ConcurrencyException('Invitation', model.id);
          }

          const dataToUpdate = {
            ...model,
            version: model.version + 1,
            updatedAt: new Date()
          };

          await transactionClient.invitation.update({
            where: { id: model.id, version: model.version },
            data: dataToUpdate
          });
          
          (invitation as any)['_version'] = dataToUpdate.version;
        }
      });
    });
  }

  async findById(id: InvitationId): Promise<Invitation | null> {
    const model = await this.prisma.invitation.findFirst({
      where: { 
        id: id.value,
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }

  async findPendingByEmailAndWorkspace(email: Email, workspaceRef: WorkspaceRef): Promise<Invitation | null> {
    const model = await this.prisma.invitation.findFirst({
      where: { 
        email: email.value,
        workspaceRef: workspaceRef.value,
        status: 'Pending',
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }

  async findAllPendingByWorkspace(workspaceRef: WorkspaceRef): Promise<Invitation[]> {
    const models = await this.prisma.invitation.findMany({
      where: { 
        workspaceRef: workspaceRef.value,
        status: 'Pending',
        isDeleted: false 
      }
    });

    return models.map(model => this.aggregateMapper.toDomain(model));
  }
}
