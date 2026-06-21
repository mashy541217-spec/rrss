import { IWorkspaceRepository } from '../../../../../../apps/api/src/modules/workspace/domain/repositories/IWorkspaceRepository';
import { Workspace } from '../../../../../../apps/api/src/modules/workspace/domain/aggregates/Workspace';
import { WorkspaceId } from '../../../../../../apps/api/src/modules/workspace/domain/value-objects/WorkspaceId';
import { WorkspaceName } from '../../../../../../apps/api/src/modules/workspace/domain/value-objects/WorkspaceName';

export class FakeWorkspaceRepository implements IWorkspaceRepository {
  private readonly items = new Map<string, Workspace>();

  public async save(workspace: Workspace): Promise<void> {
    this.items.set(workspace.id.value, workspace);
  }

  public async findById(id: WorkspaceId): Promise<Workspace | null> {
    const workspace = this.items.get(id.value);
    return workspace || null;
  }

  public async findByName(name: WorkspaceName): Promise<Workspace | null> {
    for (const workspace of this.items.values()) {
      if (workspace.name.value.toLowerCase() === name.value.toLowerCase()) {
        return workspace;
      }
    }
    return null;
  }

  // Testing helper methods
  public getSavedWorkspaces(): Workspace[] {
    return Array.from(this.items.values());
  }

  public clear(): void {
    this.items.clear();
  }
}
