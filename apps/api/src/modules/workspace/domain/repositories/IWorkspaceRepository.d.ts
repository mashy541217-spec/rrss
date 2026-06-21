import { IRepository } from '@rrss-auto/domain';
import { Workspace } from '../aggregates/Workspace';
import { WorkspaceId } from '../value-objects/WorkspaceId';
import { WorkspaceName } from '../value-objects/WorkspaceName';
export interface IWorkspaceRepository extends IRepository<Workspace, WorkspaceId> {
    save(workspace: Workspace): Promise<void>;
    findById(id: WorkspaceId): Promise<Workspace | null>;
    findByName(name: WorkspaceName): Promise<Workspace | null>;
}
