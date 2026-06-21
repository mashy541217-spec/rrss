import { AggregateRoot } from '@rrss-auto/domain';
import { WorkspaceId } from '../value-objects/WorkspaceId';
import { WorkspaceName } from '../value-objects/WorkspaceName';
import { WorkspaceSlug } from '../value-objects/WorkspaceSlug';
import { WorkspaceOwnerId } from '../value-objects/WorkspaceOwnerId';
import { WorkspaceStatus } from '../enums/WorkspaceStatus';
import { WorkspaceSettings } from '../value-objects/WorkspaceSettings';
import { WorkspaceLimits } from '../value-objects/WorkspaceLimits';

import { InvalidWorkspaceTransitionException } from '../exceptions/InvalidWorkspaceTransitionException';
import { WorkspaceSuspendedException } from '../exceptions/WorkspaceSuspendedException';
import { WorkspaceArchivedException } from '../exceptions/WorkspaceArchivedException';

import { WorkspaceSuspended } from '../domain-events/WorkspaceSuspended';
import { WorkspaceActivated } from '../domain-events/WorkspaceActivated';
import { WorkspaceArchived } from '../domain-events/WorkspaceArchived';
import { WorkspaceSettingsUpdated } from '../domain-events/WorkspaceSettingsUpdated';
import { WorkspaceCreated } from '../domain-events/WorkspaceCreated';

export interface WorkspaceProps {
  name: WorkspaceName;
  slug: WorkspaceSlug;
  ownerId: WorkspaceOwnerId;
  status: WorkspaceStatus;
  settings: WorkspaceSettings;
  limits: WorkspaceLimits;
}

export class Workspace extends AggregateRoot<WorkspaceProps, WorkspaceId> {
  private constructor(props: WorkspaceProps, id: WorkspaceId) {
    super(props, id);
  }

  get name(): WorkspaceName { return this.props.name; }
  get slug(): WorkspaceSlug { return this.props.slug; }
  get ownerId(): WorkspaceOwnerId { return this.props.ownerId; }
  get status(): WorkspaceStatus { return this.props.status; }
  get settings(): WorkspaceSettings { return this.props.settings; }
  get limits(): WorkspaceLimits { return this.props.limits; }

  public static initialize(props: WorkspaceProps, id: WorkspaceId): Workspace {
    return new Workspace(props, id);
  }

  public static createNew(props: WorkspaceProps, id: WorkspaceId): Workspace {
    const workspace = new Workspace(props, id);
    workspace.addDomainEvent(new WorkspaceCreated(id, props.name.value, props.ownerId.value));
    return workspace;
  }

  private checkNotArchived(): void {
    if (this.props.status === WorkspaceStatus.Archived) {
      throw new WorkspaceArchivedException('Cannot perform operations on an archived workspace');
    }
  }

  private checkNotSuspended(): void {
    if (this.props.status === WorkspaceStatus.Suspended) {
      throw new WorkspaceSuspendedException('Cannot perform operations on a suspended workspace');
    }
  }

  public activate(): void {
    this.checkNotArchived();

    if (this.props.status === WorkspaceStatus.Active) {
      return; // Idempotent
    }

    if (this.props.status !== WorkspaceStatus.CreationRequested && this.props.status !== WorkspaceStatus.Suspended) {
      throw new InvalidWorkspaceTransitionException(`Cannot transition from ${this.props.status} to Active`);
    }

    this.props.status = WorkspaceStatus.Active;
    this.addDomainEvent(new WorkspaceActivated(this.id));
  }

  public suspend(): void {
    this.checkNotArchived();

    if (this.props.status === WorkspaceStatus.Suspended) {
      return; // Idempotent
    }

    if (this.props.status !== WorkspaceStatus.Active) {
      throw new InvalidWorkspaceTransitionException(`Cannot transition from ${this.props.status} to Suspended`);
    }

    this.props.status = WorkspaceStatus.Suspended;
    this.addDomainEvent(new WorkspaceSuspended(this.id));
  }

  public archive(): void {
    if (this.props.status === WorkspaceStatus.Archived) {
      return; // Idempotent
    }

    this.props.status = WorkspaceStatus.Archived;
    this.addDomainEvent(new WorkspaceArchived(this.id));
  }

  public updateSettings(newSettings: WorkspaceSettings): void {
    this.checkNotArchived();
    this.checkNotSuspended();

    this.props.settings = newSettings;
    this.addDomainEvent(new WorkspaceSettingsUpdated(this.id, newSettings));
  }

  public updateLimits(newLimits: WorkspaceLimits): void {
    this.checkNotArchived();
    this.checkNotSuspended();

    this.props.limits = newLimits;
  }
}
