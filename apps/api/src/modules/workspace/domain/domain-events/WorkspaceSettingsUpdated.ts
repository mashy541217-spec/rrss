import { IDomainEvent } from '@rrss-auto/domain';
import { WorkspaceId } from '../value-objects/WorkspaceId';
import { WorkspaceSettings } from '../value-objects/WorkspaceSettings';

export class WorkspaceSettingsUpdated implements IDomainEvent {
  public readonly occurredAt: Date;
  
  constructor(
    public readonly workspaceId: WorkspaceId,
    public readonly newSettings: WorkspaceSettings
  ) {
    this.occurredAt = new Date();
  }

  getAggregateId(): WorkspaceId {
    return this.workspaceId;
  }
}
