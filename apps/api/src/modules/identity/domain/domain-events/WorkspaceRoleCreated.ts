import { IDomainEvent } from '@rrss-auto/domain';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';

export class WorkspaceRoleCreated implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly roleId: WorkspaceRoleId,
    public readonly name: string,
    public readonly workspaceId: string,
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): WorkspaceRoleId {
    return this.roleId;
  }
}
