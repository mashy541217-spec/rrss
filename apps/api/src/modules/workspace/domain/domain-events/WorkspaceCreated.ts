import { IDomainEvent } from '@rrss-auto/domain';
import { WorkspaceId } from '../value-objects/WorkspaceId';

export class WorkspaceCreated implements IDomainEvent {
  public readonly occurredAt: Date;
  
  constructor(
    public readonly workspaceId: WorkspaceId,
    public readonly name: string,
    public readonly ownerId: string
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): WorkspaceId {
    return this.workspaceId;
  }
}
