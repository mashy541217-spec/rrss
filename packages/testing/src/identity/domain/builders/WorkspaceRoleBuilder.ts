import { WorkspaceRole } from '../../../../../../apps/api/src/modules/identity/domain/aggregates/WorkspaceRole';
import { WorkspaceRoleId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRef';
import { Permission } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/Permission';
import { WorkspaceRoleStatus } from '../../../../../../apps/api/src/modules/identity/domain/enums/WorkspaceRoleStatus';

export class WorkspaceRoleBuilder {
  private id: string = 'role-123';
  private name: string = 'Admin';
  private description: string = 'Workspace Administrator';
  private workspaceRef: string = 'wksp-123';
  private permissions: Permission[] = [];
  private status: WorkspaceRoleStatus = WorkspaceRoleStatus.Active;

  public static create(): WorkspaceRoleBuilder {
    return new WorkspaceRoleBuilder();
  }

  public withId(id: string): this {
    this.id = id;
    return this;
  }

  public withName(name: string): this {
    this.name = name;
    return this;
  }

  public withDescription(description: string): this {
    this.description = description;
    return this;
  }

  public withWorkspaceRef(workspaceRef: string): this {
    this.workspaceRef = workspaceRef;
    return this;
  }

  public withPermissions(permissions: string[]): this {
    this.permissions = permissions.map((p) => Permission.create(p));
    return this;
  }

  public withStatus(status: WorkspaceRoleStatus): this {
    this.status = status;
    return this;
  }

  public build(): WorkspaceRole {
    return WorkspaceRole.initialize(
      {
        name: this.name,
        description: this.description,
        workspaceRef: WorkspaceRef.create(this.workspaceRef),
        permissions: this.permissions,
        status: this.status,
      },
      WorkspaceRoleId.create(this.id),
    );
  }
}
