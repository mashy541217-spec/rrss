import { AggregateRoot } from '@rrss-auto/domain';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { Permission } from '../value-objects/Permission';
import { WorkspaceRoleStatus } from '../enums/WorkspaceRoleStatus';
import { WorkspaceRoleCreated } from '../domain-events/WorkspaceRoleCreated';
import { WorkspaceRoleDeactivated } from '../domain-events/WorkspaceRoleDeactivated';
import { PermissionGrantedToRole } from '../domain-events/PermissionGrantedToRole';
import { PermissionRevokedFromRole } from '../domain-events/PermissionRevokedFromRole';
import { WorkspaceRoleInactiveException } from '../exceptions/WorkspaceRoleInactiveException';
import { DuplicatePermissionException } from '../exceptions/DuplicatePermissionException';

export interface WorkspaceRoleProps {
  name: string;
  description: string;
  workspaceRef: WorkspaceRef;
  permissions: Permission[];
  status: WorkspaceRoleStatus;
}

/**
 * WorkspaceRole – Aggregate Root.
 *
 * Roles are NOT global. Every Workspace owns its own role catalog.
 * Different Workspaces may define completely different roles.
 *
 * Invariants:
 * - Cannot have duplicate permissions.
 * - An inactive role cannot have permissions added.
 * - Belongs exclusively to one Workspace (workspaceRef).
 */
export class WorkspaceRole extends AggregateRoot<WorkspaceRoleProps, WorkspaceRoleId> {
  private constructor(props: WorkspaceRoleProps, id: WorkspaceRoleId) {
    super(props, id);
  }

  get name(): string { return this.props.name; }
  get description(): string { return this.props.description; }
  get workspaceRef(): WorkspaceRef { return this.props.workspaceRef; }
  get permissions(): ReadonlyArray<Permission> { return [...this.props.permissions]; }
  get status(): WorkspaceRoleStatus { return this.props.status; }
  get isActive(): boolean { return this.props.status === WorkspaceRoleStatus.Active; }

  /** Factory: reconstitute from persistence. */
  public static initialize(props: WorkspaceRoleProps, id: WorkspaceRoleId): WorkspaceRole {
    return new WorkspaceRole(props, id);
  }

  /** Factory: create a new workspace role – fires WorkspaceRoleCreated. */
  public static createNew(props: Omit<WorkspaceRoleProps, 'status' | 'permissions'>, id: WorkspaceRoleId, initialPermissions: Permission[] = []): WorkspaceRole {
    const role = new WorkspaceRole(
      {
        ...props,
        permissions: [],
        status: WorkspaceRoleStatus.Active,
      },
      id,
    );
    role.addDomainEvent(
      new WorkspaceRoleCreated(id, props.name, props.workspaceRef.value),
    );
    // add initial permissions individually so events fire
    for (const perm of initialPermissions) {
      role.addPermission(perm);
    }
    return role;
  }

  /** Grant a permission to this role. */
  public addPermission(permission: Permission): void {
    this.guardActive('addPermission');

    const alreadyExists = this.props.permissions.some(
      (p) => p.identifier === permission.identifier,
    );

    if (alreadyExists) {
      throw new DuplicatePermissionException(
        `Permission '${permission.identifier}' is already granted to role '${this.id.value}'`,
      );
    }

    this.props.permissions.push(permission);
    this.addDomainEvent(new PermissionGrantedToRole(this.id, permission.identifier));
  }

  /** Revoke a permission from this role. */
  public removePermission(permission: Permission): void {
    const index = this.props.permissions.findIndex(
      (p) => p.identifier === permission.identifier,
    );

    if (index === -1) {
      return; // idempotent – silently ignore missing permission
    }

    this.props.permissions.splice(index, 1);
    this.addDomainEvent(new PermissionRevokedFromRole(this.id, permission.identifier));
  }

  /** Check whether this role grants a given permission. */
  public hasPermission(permission: Permission): boolean {
    return this.props.permissions.some(
      (p) => p.identifier === permission.identifier,
    );
  }

  /** Deactivate the role. Cannot add permissions after this. */
  public deactivate(): void {
    if (this.props.status === WorkspaceRoleStatus.Inactive) {
      return; // idempotent
    }

    this.props.status = WorkspaceRoleStatus.Inactive;
    this.addDomainEvent(new WorkspaceRoleDeactivated(this.id));
  }

  private guardActive(operation: string): void {
    if (this.props.status !== WorkspaceRoleStatus.Active) {
      throw new WorkspaceRoleInactiveException(
        `Cannot perform '${operation}' on an inactive role '${this.id.value}'`,
      );
    }
  }
}
