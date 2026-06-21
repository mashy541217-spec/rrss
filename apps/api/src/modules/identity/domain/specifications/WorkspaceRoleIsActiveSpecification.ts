import { Specification } from '@rrss-auto/domain';
import { WorkspaceRole } from '../aggregates/WorkspaceRole';
import { WorkspaceRoleStatus } from '../enums/WorkspaceRoleStatus';

export class WorkspaceRoleIsActiveSpecification extends Specification<WorkspaceRole> {
  public isSatisfiedBy(role: WorkspaceRole): boolean {
    return role.status === WorkspaceRoleStatus.Active;
  }
}
