import { Membership } from '../aggregates/Membership';
import { MembershipId } from '../value-objects/MembershipId';
import { UserId } from '../value-objects/UserId';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';
import { MembershipStatus } from '../enums/MembershipStatus';
import { MembershipCreated } from '../domain-events/MembershipCreated';
import { MembershipAccepted } from '../domain-events/MembershipAccepted';
import { MembershipSuspended } from '../domain-events/MembershipSuspended';
import { MembershipRevoked } from '../domain-events/MembershipRevoked';
import { MemberRoleChanged } from '../domain-events/MemberRoleChanged';
import { InvalidMembershipTransitionException } from '../exceptions/InvalidMembershipTransitionException';
import { MembershipAlreadyRevokedException } from '../exceptions/MembershipAlreadyRevokedException';

describe('Membership Aggregate', () => {
  const id = MembershipId.create('memb-123');
  const userId = UserId.create('usr-123');
  const workspaceRef = WorkspaceRef.create('wksp-123');
  const roleId = WorkspaceRoleId.create('role-123');

  it('should invite a user, creating membership in Invited status and fire MembershipCreated', () => {
    const membership = Membership.invite({ userId, workspaceRef, roleId }, id);

    expect(membership.id.value).toBe(id.value);
    expect(membership.userId.value).toBe(userId.value);
    expect(membership.workspaceRef.value).toBe(workspaceRef.value);
    expect(membership.roleId.value).toBe(roleId.value);
    expect(membership.status).toBe(MembershipStatus.Invited);
    expect(membership.isActive).toBe(false);

    expect(membership.domainEvents).toHaveLength(1);
    expect(membership.domainEvents[0]).toBeInstanceOf(MembershipCreated);
    const event = membership.domainEvents[0] as MembershipCreated;
    expect(event.getAggregateId().value).toBe(id.value);
    expect(event.userId).toBe(userId.value);
    expect(event.workspaceId).toBe(workspaceRef.value);
    expect(event.roleId).toBe(roleId.value);
  });

  it('should acknowledge an invitation to transition status to Pending', () => {
    const membership = Membership.invite({ userId, workspaceRef, roleId }, id);
    membership.clearDomainEvents();

    membership.acknowledge();

    expect(membership.status).toBe(MembershipStatus.Pending);
  });

  it('should accept an invitation to transition status to Accepted (Active)', () => {
    const membership = Membership.invite({ userId, workspaceRef, roleId }, id);
    membership.clearDomainEvents();

    membership.accept();

    expect(membership.status).toBe(MembershipStatus.Accepted);
    expect(membership.isActive).toBe(true);

    expect(membership.domainEvents).toHaveLength(1);
    expect(membership.domainEvents[0]).toBeInstanceOf(MembershipAccepted);
  });

  it('should suspend accepted membership and fire MembershipSuspended', () => {
    const membership = Membership.invite({ userId, workspaceRef, roleId }, id);
    membership.accept();
    membership.clearDomainEvents();

    membership.suspend('abuse');

    expect(membership.status).toBe(MembershipStatus.Suspended);
    expect(membership.isActive).toBe(false);

    expect(membership.domainEvents).toHaveLength(1);
    expect(membership.domainEvents[0]).toBeInstanceOf(MembershipSuspended);
    const event = membership.domainEvents[0] as MembershipSuspended;
    expect(event.getAggregateId().value).toBe(id.value);
    expect(event.reason).toBe('abuse');
  });

  it('should throw exception when suspending non-accepted memberships', () => {
    const membership = Membership.invite({ userId, workspaceRef, roleId }, id);
    expect(() => membership.suspend('reason')).toThrow(InvalidMembershipTransitionException);
  });

  it('should revoke membership and fire MembershipRevoked', () => {
    const membership = Membership.invite({ userId, workspaceRef, roleId }, id);
    membership.clearDomainEvents();

    membership.revoke();

    expect(membership.status).toBe(MembershipStatus.Revoked);
    expect(membership.isActive).toBe(false);

    expect(membership.domainEvents).toHaveLength(1);
    expect(membership.domainEvents[0]).toBeInstanceOf(MembershipRevoked);

    // Idempotent
    membership.clearDomainEvents();
    membership.revoke();
    expect(membership.domainEvents).toHaveLength(0);
  });

  it('should throw MembershipAlreadyRevokedException when modifying a revoked membership', () => {
    const membership = Membership.invite({ userId, workspaceRef, roleId }, id);
    membership.revoke();

    expect(() => membership.acknowledge()).toThrow(MembershipAlreadyRevokedException);
    expect(() => membership.accept()).toThrow(MembershipAlreadyRevokedException);
    expect(() => membership.suspend('reason')).toThrow(MembershipAlreadyRevokedException);
    expect(() => membership.assignRole(roleId)).toThrow(MembershipAlreadyRevokedException);
  });

  it('should assign a new role to the member and fire MemberRoleChanged event', () => {
    const membership = Membership.invite({ userId, workspaceRef, roleId }, id);
    membership.clearDomainEvents();

    const newRoleId = WorkspaceRoleId.create('role-456');
    membership.assignRole(newRoleId);

    expect(membership.roleId.value).toBe(newRoleId.value);
    expect(membership.domainEvents).toHaveLength(1);
    expect(membership.domainEvents[0]).toBeInstanceOf(MemberRoleChanged);
    const event = membership.domainEvents[0] as MemberRoleChanged;
    expect(event.getAggregateId().value).toBe(id.value);
    expect(event.previousRoleId).toBe(roleId.value);
    expect(event.newRoleId).toBe(newRoleId.value);
  });
});
