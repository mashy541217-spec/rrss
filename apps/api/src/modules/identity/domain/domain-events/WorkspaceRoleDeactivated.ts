import { IDomainEvent } from '@rrss-auto/domain';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';

export class WorkspaceRoleDeactivated implements IDomainEvent {
  public readonly occurredAt: Date;

  constructor(public readonly roleId: WorkspaceRoleId) {
    this.occurredAt = new Date();
  }

  getAggregateId(): WorkspaceRoleId {
    return this.roleId;
  }
}
