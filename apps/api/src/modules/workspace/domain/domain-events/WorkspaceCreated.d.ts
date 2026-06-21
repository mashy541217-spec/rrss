import { IDomainEvent } from '@rrss-auto/domain';
import { WorkspaceId } from '../value-objects/WorkspaceId';
export declare class WorkspaceCreated implements IDomainEvent {
    readonly workspaceId: WorkspaceId;
    readonly name: string;
    readonly ownerId: string;
    readonly occurredAt: Date;
    constructor(workspaceId: WorkspaceId, name: string, ownerId: string);
    getAggregateId(): WorkspaceId;
}
