import { Injectable } from '@nestjs/common';
import { Invitation as PrismaInvitation } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { Invitation } from '../../../domain/aggregates/Invitation';
import { InvitationId } from '../../../domain/value-objects/InvitationId';
import { Email } from '../../../domain/value-objects/Email';
import { WorkspaceRef } from '../../../domain/value-objects/WorkspaceRef';
import { WorkspaceRoleId } from '../../../domain/value-objects/WorkspaceRoleId';
import { InvitationToken } from '../../../domain/value-objects/InvitationToken';
import { InvitationStatus } from '../../../domain/enums/InvitationStatus';

@Injectable()
export class InvitationMapper
  implements
    AggregateMapper<Invitation, InvitationId, PrismaInvitation>,
    PersistenceMapper<Invitation, InvitationId, PrismaInvitation>
{
  toDomain(model: PrismaInvitation): Invitation {
    const invitation = Invitation.initialize(
      {
        email: Email.create(model.email),
        workspaceRef: WorkspaceRef.create(model.workspaceRef),
        roleId: WorkspaceRoleId.create(model.roleId),
        token: InvitationToken.create(model.token),
        status: model.status as InvitationStatus,
        expiresAt: model.expiresAt,
      },
      InvitationId.create(model.id)
    );

    // Set version from persistence
    (invitation as any)['_version'] = model.version;

    invitation.clearDomainEvents();
    return invitation;
  }

  toPersistence(aggregate: Invitation): PrismaInvitation {
    const version = (aggregate as any)['_version'] || 1;
    const isTerminal = aggregate.status === InvitationStatus.Cancelled || aggregate.status === InvitationStatus.Expired;
    
    return {
      id: aggregate.id.value,
      email: aggregate.email.value,
      workspaceRef: aggregate.workspaceRef.value,
      roleId: aggregate.roleId.value,
      token: aggregate.token.value,
      status: aggregate.status,
      expiresAt: aggregate.expiresAt,
      version: version,
      isDeleted: isTerminal, // Logical map: cancelled/expired -> deleted
      deletedAt: isTerminal ? new Date() : null,
      createdAt: new Date(), 
      updatedAt: new Date(),
    };
  }
}
