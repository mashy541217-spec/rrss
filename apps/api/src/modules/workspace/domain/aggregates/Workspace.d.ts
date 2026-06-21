import { AggregateRoot } from '@rrss-auto/domain';
import { WorkspaceId } from '../value-objects/WorkspaceId';
import { WorkspaceName } from '../value-objects/WorkspaceName';
import { WorkspaceSlug } from '../value-objects/WorkspaceSlug';
import { WorkspaceOwnerId } from '../value-objects/WorkspaceOwnerId';
import { WorkspaceStatus } from '../enums/WorkspaceStatus';
import { WorkspaceSettings } from '../value-objects/WorkspaceSettings';
import { WorkspaceLimits } from '../value-objects/WorkspaceLimits';
export interface WorkspaceProps {
    name: WorkspaceName;
    slug: WorkspaceSlug;
    ownerId: WorkspaceOwnerId;
    status: WorkspaceStatus;
    settings: WorkspaceSettings;
    limits: WorkspaceLimits;
}
export declare class Workspace extends AggregateRoot<WorkspaceProps, WorkspaceId> {
    private constructor();
    get name(): WorkspaceName;
    get slug(): WorkspaceSlug;
    get ownerId(): WorkspaceOwnerId;
    get status(): WorkspaceStatus;
    get settings(): WorkspaceSettings;
    get limits(): WorkspaceLimits;
    static initialize(props: WorkspaceProps, id: WorkspaceId): Workspace;
    static createNew(props: WorkspaceProps, id: WorkspaceId): Workspace;
    private checkNotArchived;
    private checkNotSuspended;
    activate(): void;
    suspend(): void;
    archive(): void;
    updateSettings(newSettings: WorkspaceSettings): void;
    updateLimits(newLimits: WorkspaceLimits): void;
}
