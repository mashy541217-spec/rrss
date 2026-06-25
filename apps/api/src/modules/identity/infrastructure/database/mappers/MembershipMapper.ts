import { Injectable } from '@nestjs/common';
import { Membership as PrismaMembership } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { Membership } from '../../../domain/aggregates/Membership';
import { MembershipId } from '../../../domain/value-objects/MembershipId';
import { UserId } from '../../../domain/value-objects/UserId';
import { WorkspaceRef } from '../../../domain/value-objects/WorkspaceRef';
import { WorkspaceRoleId } from '../../../domain/value-objects/WorkspaceRoleId';
import { MembershipStatus } from '../../../domain/enums/MembershipStatus';

@Injectable()
export class MembershipMapper
  implements
    AggregateMapper<Membership, MembershipId, PrismaMembership>,
    PersistenceMapper<Membership, MembershipId, PrismaMembership>
{
  toDomain(model: PrismaMembership): Membership {
    const membership = Membership.initialize(
      {
        userId: UserId.create(model.userId),
        workspaceRef: WorkspaceRef.create(model.workspaceRef),
        roleId: WorkspaceRoleId.create(model.roleId),
        status: model.status as MembershipStatus,
      },
      MembershipId.create(model.id)
    );

    // Set version from persistence
    (membership as any)['_version'] = model.version;

    membership.clearDomainEvents();
    return membership;
  }

  toPersistence(aggregate: Membership): PrismaMembership {
    const version = (aggregate as any)['_version'] || 1;
    const isRevoked = aggregate.status === MembershipStatus.Revoked;
    
    return {
      id: aggregate.id.value,
      userId: aggregate.userId.value,
      workspaceRef: aggregate.workspaceRef.value,
      roleId: aggregate.roleId.value,
      status: aggregate.status,
      version: version,
      isDeleted: isRevoked,
      deletedAt: isRevoked ? new Date() : null,
      createdAt: new Date(), 
      updatedAt: new Date(),
    };
  }
}
