import { IDomainEvent } from '@rrss-auto/domain';
import { WorkspaceId } from '../value-objects/WorkspaceId';
export declare class WorkspaceSuspended implements IDomainEvent {
    readonly workspaceId: WorkspaceId;
    readonly occurredAt: Date;
    constructor(workspaceId: WorkspaceId);
    getAggregateId(): WorkspaceId;
}
