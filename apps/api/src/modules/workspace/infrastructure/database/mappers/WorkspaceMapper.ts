import { Injectable } from '@nestjs/common';
import { Workspace as PrismaWorkspace } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { Workspace } from '../../../domain/aggregates/Workspace';
import { WorkspaceId } from '../../../domain/value-objects/WorkspaceId';
import { WorkspaceName } from '../../../domain/value-objects/WorkspaceName';
import { WorkspaceSlug } from '../../../domain/value-objects/WorkspaceSlug';
import { WorkspaceOwnerId } from '../../../domain/value-objects/WorkspaceOwnerId';
import { WorkspaceStatus } from '../../../domain/enums/WorkspaceStatus';
import { WorkspaceSettings } from '../../../domain/value-objects/WorkspaceSettings';
import { WorkspaceLimits } from '../../../domain/value-objects/WorkspaceLimits';
import { WorkspaceTimezone } from '../../../domain/value-objects/WorkspaceTimezone';

@Injectable()
export class WorkspaceMapper
  implements
    AggregateMapper<Workspace, WorkspaceId, PrismaWorkspace>,
    PersistenceMapper<Workspace, WorkspaceId, PrismaWorkspace>
{
  toDomain(model: PrismaWorkspace): Workspace {
    const rawSettings = model.settings as any;
    const settings = WorkspaceSettings.create(
      WorkspaceTimezone.create(rawSettings.timezone?.value || rawSettings.timezone || 'UTC'),
      rawSettings.locale || 'en'
    );

    const rawLimits = model.limits as any;
    const limits = WorkspaceLimits.create({
      maxBusinesses: rawLimits.maxBusinesses || 1,
      maxConcurrentExecutions: rawLimits.maxConcurrentExecutions || 1,
      maxProxies: rawLimits.maxProxies || 0,
      maxVms: rawLimits.maxVms || 0
    });

    const workspace = Workspace.initialize(
      {
        name: WorkspaceName.create(model.name),
        slug: WorkspaceSlug.create(model.slug),
        ownerId: WorkspaceOwnerId.create(model.ownerId),
        status: model.status as WorkspaceStatus,
        settings,
        limits,
      },
      WorkspaceId.create(model.id)
    );

    // Set version from persistence
    (workspace as any)['_version'] = model.version;

    workspace.clearDomainEvents(); // Clear any events from creation during mapping
    return workspace;
  }

  toPersistence(aggregate: Workspace): PrismaWorkspace {
    const version = (aggregate as any)['_version'] || 1;
    
    return {
      id: aggregate.id.value,
      name: aggregate.name.value,
      slug: aggregate.slug.value,
      ownerId: aggregate.ownerId.value,
      status: aggregate.status,
      settings: {
        timezone: { value: aggregate.settings.timezone.value },
        locale: aggregate.settings.locale
      } as any,
      limits: {
        maxBusinesses: aggregate.limits.maxBusinesses,
        maxConcurrentExecutions: aggregate.limits.maxConcurrentExecutions,
        maxProxies: aggregate.limits.maxProxies,
        maxVms: aggregate.limits.maxVms
      } as any,
      version: version, 
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(), 
      updatedAt: new Date(),
    };
  }
}
