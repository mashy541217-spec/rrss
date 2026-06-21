import { Invitation } from '../aggregates/Invitation';
import { InvitationId } from '../value-objects/InvitationId';
import { Email } from '../value-objects/Email';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';
import { InvitationToken } from '../value-objects/InvitationToken';
import { InvitationStatus } from '../enums/InvitationStatus';
import { InvitationSent } from '../domain-events/InvitationSent';
import { InvitationAccepted } from '../domain-events/InvitationAccepted';
import { InvitationCancelled } from '../domain-events/InvitationCancelled';
import { InvitationExpired } from '../domain-events/InvitationExpired';
import { InvitationAlreadyUsedException } from '../exceptions/InvitationAlreadyUsedException';
import { InvitationExpiredException } from '../exceptions/InvitationExpiredException';

describe('Invitation Aggregate', () => {
  const id = InvitationId.create('inv-123');
  const email = Email.create('invitee@example.com');
  const workspaceRef = WorkspaceRef.create('wksp-123');
  const roleId = WorkspaceRoleId.create('role-123');
  const token = InvitationToken.create('token-123456789012');
  const expiresAt = new Date(Date.now() + 10000); // 10s from now

  it('should send a new invitation, in Pending status, and fire InvitationSent event', () => {
    const invitation = Invitation.send(
      {
        email,
        workspaceRef,
        roleId,
        token,
        expiresAt,
      },
      id,
    );

    expect(invitation.id.value).toBe(id.value);
    expect(invitation.email.value).toBe(email.value);
    expect(invitation.workspaceRef.value).toBe(workspaceRef.value);
    expect(invitation.roleId.value).toBe(roleId.value);
    expect(invitation.token.value).toBe(token.value);
    expect(invitation.status).toBe(InvitationStatus.Pending);
    expect(invitation.isPending).toBe(true);
    expect(invitation.isExpired).toBe(false);

    expect(invitation.domainEvents).toHaveLength(1);
    expect(invitation.domainEvents[0]).toBeInstanceOf(InvitationSent);
    const event = invitation.domainEvents[0] as InvitationSent;
    expect(event.getAggregateId().value).toBe(id.value);
    expect(event.email).toBe(email.value);
    expect(event.workspaceId).toBe(workspaceRef.value);
    expect(event.roleId).toBe(roleId.value);
  });

  it('should accept invitation with valid token and fire InvitationAccepted event', () => {
    const invitation = Invitation.send({ email, workspaceRef, roleId, token, expiresAt }, id);
    invitation.clearDomainEvents();

    invitation.accept('token-123456789012', 'usr-456');

    expect(invitation.status).toBe(InvitationStatus.Accepted);
    expect(invitation.isPending).toBe(false);
    expect(invitation.domainEvents).toHaveLength(1);
    expect(invitation.domainEvents[0]).toBeInstanceOf(InvitationAccepted);
    const event = invitation.domainEvents[0] as InvitationAccepted;
    expect(event.getAggregateId().value).toBe(id.value);
    expect(event.userId).toBe('usr-456');
    expect(event.workspaceId).toBe(workspaceRef.value);
  });

  it('should throw InvitationAlreadyUsedException when accepting with incorrect token', () => {
    const invitation = Invitation.send({ email, workspaceRef, roleId, token, expiresAt }, id);
    expect(() => invitation.accept('wrong-token', 'usr-456')).toThrow(InvitationAlreadyUsedException);
  });

  it('should throw InvitationExpiredException if invitation is expired by time', () => {
    const pastExpiry = new Date(Date.now() - 1000); // 1s ago
    const invitation = Invitation.send({ email, workspaceRef, roleId, token, expiresAt: pastExpiry }, id);
    expect(invitation.isExpired).toBe(true);
    expect(() => invitation.accept('token-123456789012', 'usr-456')).toThrow(InvitationExpiredException);
  });

  it('should cancel invitation and fire InvitationCancelled event', () => {
    const invitation = Invitation.send({ email, workspaceRef, roleId, token, expiresAt }, id);
    invitation.clearDomainEvents();

    invitation.cancel();

    expect(invitation.status).toBe(InvitationStatus.Cancelled);
    expect(invitation.domainEvents).toHaveLength(1);
    expect(invitation.domainEvents[0]).toBeInstanceOf(InvitationCancelled);
  });

  it('should expire invitation and fire InvitationExpired event', () => {
    const invitation = Invitation.send({ email, workspaceRef, roleId, token, expiresAt }, id);
    invitation.clearDomainEvents();

    invitation.expire();

    expect(invitation.status).toBe(InvitationStatus.Expired);
    expect(invitation.isExpired).toBe(true);
    expect(invitation.domainEvents).toHaveLength(1);
    expect(invitation.domainEvents[0]).toBeInstanceOf(InvitationExpired);
  });

  it('should throw InvitationAlreadyUsedException when cancelling/expiring/accepting an already used/cancelled invitation', () => {
    const invitation = Invitation.send({ email, workspaceRef, roleId, token, expiresAt }, id);
    invitation.cancel();

    expect(() => invitation.accept('token-123456789012', 'usr-456')).toThrow(InvitationAlreadyUsedException);
    expect(() => invitation.cancel()).toThrow(InvitationAlreadyUsedException);
    expect(() => invitation.expire()).toThrow(InvitationAlreadyUsedException);
  });
});
