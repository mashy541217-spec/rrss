import { Workspace } from '../aggregates/Workspace';
import { WorkspaceId } from '../value-objects/WorkspaceId';
import { WorkspaceName } from '../value-objects/WorkspaceName';
import { WorkspaceSlug } from '../value-objects/WorkspaceSlug';
import { WorkspaceOwnerId } from '../value-objects/WorkspaceOwnerId';
import { WorkspaceSettings } from '../value-objects/WorkspaceSettings';
import { WorkspaceLimits } from '../value-objects/WorkspaceLimits';
import { WorkspaceStatus } from '../enums/WorkspaceStatus';

export interface CreateWorkspaceProps {
  id: WorkspaceId;
  name: WorkspaceName;
  slug: WorkspaceSlug;
  ownerId: WorkspaceOwnerId;
  settings: WorkspaceSettings;
  limits: WorkspaceLimits;
}

export class WorkspaceFactory {
  public static create(props: CreateWorkspaceProps): Workspace {
    return Workspace.createNew(
      {
        name: props.name,
        slug: props.slug,
        ownerId: props.ownerId,
        status: WorkspaceStatus.CreationRequested,
        settings: props.settings,
        limits: props.limits,
      },
      props.id
    );
  }
}
