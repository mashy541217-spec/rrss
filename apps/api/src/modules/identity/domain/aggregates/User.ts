import { AggregateRoot } from '@rrss-auto/domain';
import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { PasswordHash } from '../value-objects/PasswordHash';
import { DisplayName } from '../value-objects/DisplayName';
import { UserStatus } from '../enums/UserStatus';
import { UserRegistered } from '../domain-events/UserRegistered';
import { UserVerified } from '../domain-events/UserVerified';
import { UserSuspended } from '../domain-events/UserSuspended';
import { UserDeleted } from '../domain-events/UserDeleted';
import { UserAlreadySuspendedException } from '../exceptions/UserAlreadySuspendedException';
import { UserAlreadyDeletedException } from '../exceptions/UserAlreadyDeletedException';

export interface UserProps {
  email: Email;
  displayName: DisplayName;
  passwordHash: PasswordHash;
  status: UserStatus;
}

/**
 * User – Platform Aggregate Root.
 *
 * Represents a global platform identity.
 * A User is NEVER owned by a Workspace.
 * A User may hold Memberships across multiple Workspaces.
 *
 * Invariants:
 * - Email is immutable after creation.
 * - A deleted User cannot be reactivated or suspended.
 * - A suspended User cannot be suspended again.
 */
export class User extends AggregateRoot<UserProps, UserId> {
  private constructor(props: UserProps, id: UserId) {
    super(props, id);
  }

  get email(): Email { return this.props.email; }
  get displayName(): DisplayName { return this.props.displayName; }
  get passwordHash(): PasswordHash { return this.props.passwordHash; }
  get status(): UserStatus { return this.props.status; }

  /** Factory: reconstitute from persistence (no event fired). */
  public static initialize(props: UserProps, id: UserId): User {
    return new User(props, id);
  }

  /** Factory: create new platform identity – fires UserRegistered. */
  public static createNew(props: Omit<UserProps, 'status'>, id: UserId): User {
    const user = new User({ ...props, status: UserStatus.PendingVerification }, id);
    user.addDomainEvent(
      new UserRegistered(id, props.email.value, props.displayName.value),
    );
    return user;
  }

  /** Verify the user's identity: PendingVerification → Active. */
  public verify(): void {
    this.guardNotDeleted('verify');

    if (this.props.status === UserStatus.Active) {
      return; // idempotent
    }

    this.props.status = UserStatus.Active;
    this.addDomainEvent(new UserVerified(this.id));
  }

  /** Suspend the user: Active → Suspended. */
  public suspend(reason: string): void {
    this.guardNotDeleted('suspend');

    if (this.props.status === UserStatus.Suspended) {
      throw new UserAlreadySuspendedException(
        `User '${this.id.value}' is already suspended`,
      );
    }

    this.props.status = UserStatus.Suspended;
    this.addDomainEvent(new UserSuspended(this.id, reason));
  }

  /** Permanently delete the user. Cannot be undone. */
  public delete(): void {
    if (this.props.status === UserStatus.Deleted) {
      return; // idempotent
    }

    this.props.status = UserStatus.Deleted;
    this.addDomainEvent(new UserDeleted(this.id));
  }

  public get isActive(): boolean {
    return this.props.status === UserStatus.Active;
  }

  public get isPendingVerification(): boolean {
    return this.props.status === UserStatus.PendingVerification;
  }

  public get isDeleted(): boolean {
    return this.props.status === UserStatus.Deleted;
  }

  private guardNotDeleted(operation: string): void {
    if (this.props.status === UserStatus.Deleted) {
      throw new UserAlreadyDeletedException(
        `Cannot perform '${operation}' on deleted user '${this.id.value}'`,
      );
    }
  }
}
