import { User } from '../aggregates/User';
import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { DisplayName } from '../value-objects/DisplayName';
import { PasswordHash } from '../value-objects/PasswordHash';
import { UserStatus } from '../enums/UserStatus';
import { UserRegistered } from '../domain-events/UserRegistered';
import { UserVerified } from '../domain-events/UserVerified';
import { UserSuspended } from '../domain-events/UserSuspended';
import { UserDeleted } from '../domain-events/UserDeleted';
import { UserAlreadySuspendedException } from '../exceptions/UserAlreadySuspendedException';
import { UserAlreadyDeletedException } from '../exceptions/UserAlreadyDeletedException';

describe('User Aggregate', () => {
  const userId = UserId.create('usr-123');
  const email = Email.create('john@example.com');
  const displayName = DisplayName.create('John Doe');
  const passwordHash = PasswordHash.create('hashed-pass');

  it('should create a new user with status PendingVerification and fire UserRegistered event', () => {
    const user = User.createNew(
      {
        email,
        displayName,
        passwordHash,
      },
      userId,
    );

    expect(user.id.value).toBe(userId.value);
    expect(user.email.value).toBe(email.value);
    expect(user.displayName.value).toBe(displayName.value);
    expect(user.passwordHash.value).toBe(passwordHash.value);
    expect(user.status).toBe(UserStatus.PendingVerification);
    expect(user.isPendingVerification).toBe(true);
    expect(user.isActive).toBe(false);

    expect(user.domainEvents).toHaveLength(1);
    expect(user.domainEvents[0]).toBeInstanceOf(UserRegistered);
    const event = user.domainEvents[0] as UserRegistered;
    expect(event.getAggregateId().value).toBe(userId.value);
    expect(event.email).toBe(email.value);
    expect(event.displayName).toBe(displayName.value);
  });

  it('should verify user and change status to Active, firing UserVerified event', () => {
    const user = User.createNew({ email, displayName, passwordHash }, userId);
    user.clearDomainEvents();

    user.verify();

    expect(user.status).toBe(UserStatus.Active);
    expect(user.isActive).toBe(true);
    expect(user.domainEvents).toHaveLength(1);
    expect(user.domainEvents[0]).toBeInstanceOf(UserVerified);
    expect((user.domainEvents[0] as UserVerified).userId.value).toBe(userId.value);

    // Idempotent
    user.clearDomainEvents();
    user.verify();
    expect(user.domainEvents).toHaveLength(0);
  });

  it('should suspend active user and fire UserSuspended event', () => {
    const user = User.createNew({ email, displayName, passwordHash }, userId);
    user.verify();
    user.clearDomainEvents();

    user.suspend('spamming behavior');

    expect(user.status).toBe(UserStatus.Suspended);
    expect(user.isActive).toBe(false);
    expect(user.domainEvents).toHaveLength(1);
    expect(user.domainEvents[0]).toBeInstanceOf(UserSuspended);
    const event = user.domainEvents[0] as UserSuspended;
    expect(event.getAggregateId().value).toBe(userId.value);
    expect(event.reason).toBe('spamming behavior');
  });

  it('should throw when trying to suspend a user that is already suspended', () => {
    const user = User.createNew({ email, displayName, passwordHash }, userId);
    user.verify();
    user.suspend('reason');

    expect(() => user.suspend('another reason')).toThrow(UserAlreadySuspendedException);
  });

  it('should delete user and fire UserDeleted event', () => {
    const user = User.createNew({ email, displayName, passwordHash }, userId);
    user.clearDomainEvents();

    user.delete();

    expect(user.status).toBe(UserStatus.Deleted);
    expect(user.isDeleted).toBe(true);
    expect(user.domainEvents).toHaveLength(1);
    expect(user.domainEvents[0]).toBeInstanceOf(UserDeleted);

    // Idempotent
    user.clearDomainEvents();
    user.delete();
    expect(user.domainEvents).toHaveLength(0);
  });

  it('should throw if verifying or suspending a deleted user', () => {
    const user = User.createNew({ email, displayName, passwordHash }, userId);
    user.delete();

    expect(() => user.verify()).toThrow(UserAlreadyDeletedException);
    expect(() => user.suspend('reason')).toThrow(UserAlreadyDeletedException);
  });
});
