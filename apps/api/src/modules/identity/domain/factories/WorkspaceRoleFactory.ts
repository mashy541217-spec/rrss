import { WorkspaceRole } from '../aggregates/WorkspaceRole';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { Permission } from '../value-objects/Permission';

export interface CreateWorkspaceRoleProps {
  id: WorkspaceRoleId;
  name: string;
  description: string;
  workspaceRef: WorkspaceRef;
  initialPermissions?: Permission[];
}

export class WorkspaceRoleFactory {
  public static create(props: CreateWorkspaceRoleProps): WorkspaceRole {
    return WorkspaceRole.createNew(
      {
        name: props.name,
        description: props.description,
        workspaceRef: props.workspaceRef,
      },
      props.id,
      props.initialPermissions ?? [],
    );
  }
}
