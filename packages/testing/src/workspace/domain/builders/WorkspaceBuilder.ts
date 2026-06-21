import { Workspace } from '../../../../../../apps/api/src/modules/workspace/domain/aggregates/Workspace';
import { WorkspaceId } from '../../../../../../apps/api/src/modules/workspace/domain/value-objects/WorkspaceId';
import { WorkspaceName } from '../../../../../../apps/api/src/modules/workspace/domain/value-objects/WorkspaceName';
import { WorkspaceSlug } from '../../../../../../apps/api/src/modules/workspace/domain/value-objects/WorkspaceSlug';
import { WorkspaceOwnerId } from '../../../../../../apps/api/src/modules/workspace/domain/value-objects/WorkspaceOwnerId';
import { WorkspaceSettings } from '../../../../../../apps/api/src/modules/workspace/domain/value-objects/WorkspaceSettings';
import { WorkspaceLimits } from '../../../../../../apps/api/src/modules/workspace/domain/value-objects/WorkspaceLimits';
import { WorkspaceStatus } from '../../../../../../apps/api/src/modules/workspace/domain/enums/WorkspaceStatus';
import { WorkspaceTimezone } from '../../../../../../apps/api/src/modules/workspace/domain/value-objects/WorkspaceTimezone';

export class WorkspaceBuilder {
  private id: string = 'wksp-123';
  private name: string = 'Default Workspace';
  private slug: string = 'default-workspace';
  private ownerId: string = 'usr-123';
  private status: WorkspaceStatus = WorkspaceStatus.CreationRequested;
  private timezone: string = 'UTC';
  private locale: string = 'en-US';
  private maxBusinesses: number = 5;
  private maxConcurrentExecutions: number = 10;
  private maxProxies: number = 20;
  private maxVms: number = 5;

  public static create(): WorkspaceBuilder {
    return new WorkspaceBuilder();
  }

  public withId(id: string): this {
    this.id = id;
    return this;
  }

  public withName(name: string): this {
    this.name = name;
    return this;
  }

  public withSlug(slug: string): this {
    this.slug = slug;
    return this;
  }

  public withOwnerId(ownerId: string): this {
    this.ownerId = ownerId;
    return this;
  }

  public withStatus(status: WorkspaceStatus): this {
    this.status = status;
    return this;
  }

  public withTimezone(timezone: string): this {
    this.timezone = timezone;
    return this;
  }

  public withLocale(locale: string): this {
    this.locale = locale;
    return this;
  }

  public withLimits(limits: {
    maxBusinesses?: number;
    maxConcurrentExecutions?: number;
    maxProxies?: number;
    maxVms?: number;
  }): this {
    if (limits.maxBusinesses !== undefined) this.maxBusinesses = limits.maxBusinesses;
    if (limits.maxConcurrentExecutions !== undefined) this.maxConcurrentExecutions = limits.maxConcurrentExecutions;
    if (limits.maxProxies !== undefined) this.maxProxies = limits.maxProxies;
    if (limits.maxVms !== undefined) this.maxVms = limits.maxVms;
    return this;
  }

  public build(): Workspace {
    const workspaceId = WorkspaceId.create(this.id);
    const workspaceName = WorkspaceName.create(this.name);
    const workspaceSlug = WorkspaceSlug.create(this.slug);
    const workspaceOwnerId = WorkspaceOwnerId.create(this.ownerId);
    
    const workspaceTimezone = WorkspaceTimezone.create(this.timezone);
    const workspaceSettings = WorkspaceSettings.create(workspaceTimezone, this.locale);
    
    const workspaceLimits = WorkspaceLimits.create({
      maxBusinesses: this.maxBusinesses,
      maxConcurrentExecutions: this.maxConcurrentExecutions,
      maxProxies: this.maxProxies,
      maxVms: this.maxVms
    });

    return Workspace.initialize(
      {
        name: workspaceName,
        slug: workspaceSlug,
        ownerId: workspaceOwnerId,
        status: this.status,
        settings: workspaceSettings,
        limits: workspaceLimits
      },
      workspaceId
    );
  }
}
