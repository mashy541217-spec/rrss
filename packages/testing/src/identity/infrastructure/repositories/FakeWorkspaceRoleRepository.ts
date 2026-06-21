import { IWorkspaceRoleRepository } from '../../../../../../apps/api/src/modules/identity/domain/repositories/IWorkspaceRoleRepository';
import { WorkspaceRole } from '../../../../../../apps/api/src/modules/identity/domain/aggregates/WorkspaceRole';
import { WorkspaceRoleId } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../../../../../../apps/api/src/modules/identity/domain/value-objects/WorkspaceRef';

export class FakeWorkspaceRoleRepository implements IWorkspaceRoleRepository {
  private readonly items = new Map<string, WorkspaceRole>();

  public async save(role: WorkspaceRole): Promise<void> {
    this.items.set(role.id.value, role);
  }

  public async findById(id: WorkspaceRoleId): Promise<WorkspaceRole | null> {
    const role = this.items.get(id.value);
    return role || null;
  }

  public async findByWorkspace(workspaceRef: WorkspaceRef): Promise<WorkspaceRole[]> {
    const roles: WorkspaceRole[] = [];
    for (const role of this.items.values()) {
      if (role.workspaceRef.value === workspaceRef.value) {
        roles.push(role);
      }
    }
    return roles;
  }

  public async findByNameAndWorkspace(name: string, workspaceRef: WorkspaceRef): Promise<WorkspaceRole | null> {
    for (const role of this.items.values()) {
      if (
        role.name.toLowerCase() === name.toLowerCase() &&
        role.workspaceRef.value === workspaceRef.value
      ) {
        return role;
      }
    }
    return null;
  }

  // Testing helper methods
  public getSavedRoles(): WorkspaceRole[] {
    return Array.from(this.items.values());
  }

  public clear(): void {
    this.items.clear();
  }
}
