import { Injectable } from '@nestjs/common';
import { WorkspaceRole as PrismaWorkspaceRole } from '@prisma/client';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { WorkspaceRole } from '../../../domain/aggregates/WorkspaceRole';
import { WorkspaceRoleId } from '../../../domain/value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../../../domain/value-objects/WorkspaceRef';
import { IWorkspaceRoleRepository } from '../../../domain/repositories/IWorkspaceRoleRepository';
import { WorkspaceRoleMapper } from '../mappers/WorkspaceRoleMapper';
import { ConcurrencyException } from '../../../../../infrastructure/database/traits/OptimisticLock';

@Injectable()
export class PrismaWorkspaceRoleRepository 
  extends BasePrismaRepository<WorkspaceRole, WorkspaceRoleId, PrismaWorkspaceRole> 
  implements IWorkspaceRoleRepository 
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: WorkspaceRoleMapper
  ) {
    super(mapper, mapper);
  }

  async save(role: WorkspaceRole): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const scope = new TransactionScope(tx);
      
      await this.saveWithEvents(role, scope, async (transactionClient, model) => {
        const existing = await transactionClient.workspaceRole.findUnique({
          where: { id: model.id }
        });

        if (!existing) {
          await transactionClient.workspaceRole.create({ data: model });
        } else {
          if (existing.version !== model.version) {
            throw new ConcurrencyException('WorkspaceRole', model.id);
          }

          const dataToUpdate = {
            ...model,
            version: model.version + 1,
            updatedAt: new Date()
          };

          await transactionClient.workspaceRole.update({
            where: { id: model.id, version: model.version },
            data: dataToUpdate
          });
          
          (role as any)['_version'] = dataToUpdate.version;
        }
      });
    });
  }

  async findById(id: WorkspaceRoleId): Promise<WorkspaceRole | null> {
    const model = await this.prisma.workspaceRole.findFirst({
      where: { 
        id: id.value,
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }

  async findByWorkspace(workspaceRef: WorkspaceRef): Promise<WorkspaceRole[]> {
    const models = await this.prisma.workspaceRole.findMany({
      where: { 
        workspaceRef: workspaceRef.value,
        isDeleted: false 
      }
    });

    return models.map(model => this.aggregateMapper.toDomain(model));
  }

  async findByNameAndWorkspace(name: string, workspaceRef: WorkspaceRef): Promise<WorkspaceRole | null> {
    const model = await this.prisma.workspaceRole.findFirst({
      where: { 
        name: name,
        workspaceRef: workspaceRef.value,
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }
}
