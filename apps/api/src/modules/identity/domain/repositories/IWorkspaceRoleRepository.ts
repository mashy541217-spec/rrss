import { IRepository } from '@rrss-auto/domain';
import { WorkspaceRole } from '../aggregates/WorkspaceRole';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';

export interface IWorkspaceRoleRepository extends IRepository<WorkspaceRole, WorkspaceRoleId> {
  save(role: WorkspaceRole): Promise<void>;
  findById(id: WorkspaceRoleId): Promise<WorkspaceRole | null>;
  findByWorkspace(workspaceRef: WorkspaceRef): Promise<WorkspaceRole[]>;
  findByNameAndWorkspace(name: string, workspaceRef: WorkspaceRef): Promise<WorkspaceRole | null>;
}
