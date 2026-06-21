import { IDomainEvent } from '@rrss-auto/domain';
import { WorkspaceId } from '../value-objects/WorkspaceId';

export class WorkspaceSuspended implements IDomainEvent {
  public readonly occurredAt: Date;
  
  constructor(
    public readonly workspaceId: WorkspaceId
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): WorkspaceId {
    return this.workspaceId;
  }
}
