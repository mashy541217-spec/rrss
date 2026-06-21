import { WorkspaceRole } from '../aggregates/WorkspaceRole';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { Permission } from '../value-objects/Permission';
import { WorkspaceRoleStatus } from '../enums/WorkspaceRoleStatus';
import { WorkspaceRoleCreated } from '../domain-events/WorkspaceRoleCreated';
import { WorkspaceRoleDeactivated } from '../domain-events/WorkspaceRoleDeactivated';
import { PermissionGrantedToRole } from '../domain-events/PermissionGrantedToRole';
import { PermissionRevokedFromRole } from '../domain-events/PermissionRevokedFromRole';
import { DuplicatePermissionException } from '../exceptions/DuplicatePermissionException';
import { WorkspaceRoleInactiveException } from '../exceptions/WorkspaceRoleInactiveException';

describe('WorkspaceRole Aggregate', () => {
  const roleId = WorkspaceRoleId.create('role-123');
  const workspaceRef = WorkspaceRef.create('wksp-123');
  const perm1 = Permission.create('workspace.create');
  const perm2 = Permission.create('workspace.delete');

  it('should create a new active workspace role and fire WorkspaceRoleCreated event', () => {
    const role = WorkspaceRole.createNew(
      {
        name: 'Admin',
        description: 'Administrator role',
        workspaceRef,
      },
      roleId,
      [perm1],
    );

    expect(role.id.value).toBe(roleId.value);
    expect(role.name).toBe('Admin');
    expect(role.description).toBe('Administrator role');
    expect(role.workspaceRef.value).toBe(workspaceRef.value);
    expect(role.status).toBe(WorkspaceRoleStatus.Active);
    expect(role.isActive).toBe(true);
    expect(role.permissions).toHaveLength(1);
    expect(role.permissions[0].identifier).toBe(perm1.identifier);

    // Should have WorkspaceRoleCreated + PermissionGrantedToRole event (added individually)
    expect(role.domainEvents).toHaveLength(2);
    expect(role.domainEvents[0]).toBeInstanceOf(WorkspaceRoleCreated);
    expect(role.domainEvents[1]).toBeInstanceOf(PermissionGrantedToRole);
  });

  it('should grant permission to role and fire PermissionGrantedToRole event', () => {
    const role = WorkspaceRole.createNew({ name: 'Role', description: 'Desc', workspaceRef }, roleId);
    role.clearDomainEvents();

    role.addPermission(perm1);

    expect(role.permissions).toHaveLength(1);
    expect(role.hasPermission(perm1)).toBe(true);
    expect(role.domainEvents).toHaveLength(1);
    expect(role.domainEvents[0]).toBeInstanceOf(PermissionGrantedToRole);
    expect((role.domainEvents[0] as PermissionGrantedToRole).permissionIdentifier).toBe(perm1.identifier);
  });

  it('should throw DuplicatePermissionException when granting already existing permission', () => {
    const role = WorkspaceRole.createNew({ name: 'Role', description: 'Desc', workspaceRef }, roleId, [perm1]);
    expect(() => role.addPermission(perm1)).toThrow(DuplicatePermissionException);
  });

  it('should remove permission from role and fire PermissionRevokedFromRole event', () => {
    const role = WorkspaceRole.createNew({ name: 'Role', description: 'Desc', workspaceRef }, roleId, [perm1]);
    role.clearDomainEvents();

    role.removePermission(perm1);

    expect(role.permissions).toHaveLength(0);
    expect(role.hasPermission(perm1)).toBe(false);
    expect(role.domainEvents).toHaveLength(1);
    expect(role.domainEvents[0]).toBeInstanceOf(PermissionRevokedFromRole);

    // Idempotent remove
    role.clearDomainEvents();
    role.removePermission(perm1);
    expect(role.domainEvents).toHaveLength(0);
  });

  it('should deactivate role and fire WorkspaceRoleDeactivated event', () => {
    const role = WorkspaceRole.createNew({ name: 'Role', description: 'Desc', workspaceRef }, roleId);
    role.clearDomainEvents();

    role.deactivate();

    expect(role.status).toBe(WorkspaceRoleStatus.Inactive);
    expect(role.isActive).toBe(false);
    expect(role.domainEvents).toHaveLength(1);
    expect(role.domainEvents[0]).toBeInstanceOf(WorkspaceRoleDeactivated);

    // Idempotent
    role.clearDomainEvents();
    role.deactivate();
    expect(role.domainEvents).toHaveLength(0);
  });

  it('should throw WorkspaceRoleInactiveException when trying to add permission to inactive role', () => {
    const role = WorkspaceRole.createNew({ name: 'Role', description: 'Desc', workspaceRef }, roleId);
    role.deactivate();
    expect(() => role.addPermission(perm1)).toThrow(WorkspaceRoleInactiveException);
  });
});
