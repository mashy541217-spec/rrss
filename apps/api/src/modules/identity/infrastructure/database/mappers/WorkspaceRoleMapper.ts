import { Injectable } from '@nestjs/common';
import { WorkspaceRole as PrismaWorkspaceRole } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { WorkspaceRole } from '../../../domain/aggregates/WorkspaceRole';
import { WorkspaceRoleId } from '../../../domain/value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../../../domain/value-objects/WorkspaceRef';
import { Permission } from '../../../domain/value-objects/Permission';
import { WorkspaceRoleStatus } from '../../../domain/enums/WorkspaceRoleStatus';

@Injectable()
export class WorkspaceRoleMapper
  implements
    AggregateMapper<WorkspaceRole, WorkspaceRoleId, PrismaWorkspaceRole>,
    PersistenceMapper<WorkspaceRole, WorkspaceRoleId, PrismaWorkspaceRole>
{
  toDomain(model: PrismaWorkspaceRole): WorkspaceRole {
    const permissions = model.permissions.map(p => Permission.create(p));
    
    // We recreate it using initialize and manually assign the permissions because
    // the constructor requires `permissions` in props, but our initialize signature 
    // takes WorkspaceRoleProps which has permissions.
    const role = WorkspaceRole.initialize(
      {
        name: model.name,
        description: model.description,
        workspaceRef: WorkspaceRef.create(model.workspaceRef),
        permissions: permissions,
        status: model.status as WorkspaceRoleStatus,
      },
      WorkspaceRoleId.create(model.id)
    );

    // Set version from persistence
    (role as any)['_version'] = model.version;

    role.clearDomainEvents();
    return role;
  }

  toPersistence(aggregate: WorkspaceRole): PrismaWorkspaceRole {
    const version = (aggregate as any)['_version'] || 1;
    const isInactive = aggregate.status === WorkspaceRoleStatus.Inactive;
    
    return {
      id: aggregate.id.value,
      name: aggregate.name,
      description: aggregate.description,
      workspaceRef: aggregate.workspaceRef.value,
      permissions: aggregate.permissions.map(p => p.identifier),
      status: aggregate.status,
      version: version,
      isDeleted: isInactive,
      deletedAt: isInactive ? new Date() : null,
      createdAt: new Date(), 
      updatedAt: new Date(),
    };
  }
}
