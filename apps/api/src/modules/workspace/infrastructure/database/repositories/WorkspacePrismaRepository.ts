import { Injectable } from '@nestjs/common';
import { Workspace as PrismaWorkspace } from '@prisma/client';
import { PrismaService } from '../../../../../infrastructure/database/prisma/PrismaService';
import { BasePrismaRepository } from '../../../../../infrastructure/database/repositories/BasePrismaRepository';
import { TransactionScope } from '../../../../../infrastructure/database/uow/TransactionScope';
import { Workspace } from '../../../domain/aggregates/Workspace';
import { WorkspaceId } from '../../../domain/value-objects/WorkspaceId';
import { WorkspaceName } from '../../../domain/value-objects/WorkspaceName';
import { IWorkspaceRepository } from '../../../domain/repositories/IWorkspaceRepository';
import { WorkspaceMapper } from '../mappers/WorkspaceMapper';
import { ConcurrencyException } from '../../../../../infrastructure/database/traits/OptimisticLock';

@Injectable()
export class WorkspacePrismaRepository 
  extends BasePrismaRepository<Workspace, WorkspaceId, PrismaWorkspace> 
  implements IWorkspaceRepository 
{
  constructor(
    private readonly prisma: PrismaService,
    mapper: WorkspaceMapper
  ) {
    super(mapper, mapper);
  }

  async save(workspace: Workspace): Promise<void> {
    // If we want to support external UoW we'd accept a TransactionScope in save().
    // Since IWorkspaceRepository.save doesn't accept a scope, we create a local transaction
    // to ensure outbox events and the aggregate are saved atomically.
    await this.prisma.$transaction(async (tx) => {
      const scope = new TransactionScope(tx);
      
      await this.saveWithEvents(workspace, scope, async (transactionClient, model) => {
        // Find existing to check version for optimistic locking
        const existing = await transactionClient.workspace.findUnique({
          where: { id: model.id }
        });

        if (!existing) {
          // Create
          await transactionClient.workspace.create({
            data: model
          });
        } else {
          // Update with optimistic locking check
          if (existing.version !== model.version) {
            throw new ConcurrencyException('Workspace', model.id);
          }

          // Increment version and update
          const dataToUpdate = {
            ...model,
            version: model.version + 1,
            updatedAt: new Date()
          };

          await transactionClient.workspace.update({
            where: { id: model.id, version: model.version },
            data: dataToUpdate
          });
          
          // Set new version on aggregate
          (workspace as any)['_version'] = dataToUpdate.version;
        }
      });
    });
  }

  async findById(id: WorkspaceId): Promise<Workspace | null> {
    const model = await this.prisma.workspace.findFirst({
      where: { 
        id: id.value,
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }

  async findByName(name: WorkspaceName): Promise<Workspace | null> {
    const model = await this.prisma.workspace.findFirst({
      where: { 
        name: name.value,
        isDeleted: false 
      }
    });

    if (!model) return null;
    return this.aggregateMapper.toDomain(model);
  }
}
