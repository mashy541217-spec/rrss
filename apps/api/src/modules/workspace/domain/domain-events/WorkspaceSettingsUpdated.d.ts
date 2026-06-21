import { IDomainEvent } from '@rrss-auto/domain';
import { WorkspaceId } from '../value-objects/WorkspaceId';
import { WorkspaceSettings } from '../value-objects/WorkspaceSettings';
export declare class WorkspaceSettingsUpdated implements IDomainEvent {
    readonly workspaceId: WorkspaceId;
    readonly newSettings: WorkspaceSettings;
    readonly occurredAt: Date;
    constructor(workspaceId: WorkspaceId, newSettings: WorkspaceSettings);
    getAggregateId(): WorkspaceId;
}
