import { AggregateRoot } from '@rrss-auto/domain';
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

export interface MembershipProps {
  userId: UserId;
  workspaceRef: WorkspaceRef;
  roleId: WorkspaceRoleId;
  status: MembershipStatus;
}

/**
 * Membership – Aggregate Root.
 *
 * Represents the relationship between a User and a Workspace.
 * A single User may hold Memberships in multiple Workspaces.
 *
 * Lifecycle:
 *   Invited → Pending → Accepted → Suspended → Revoked
 *
 * Invariants:
 * - A revoked Membership cannot be reinstated.
 * - Role assignments fire a dedicated domain event for auditability.
 * - Cross-aggregate references (User, Workspace) are by ID only.
 */
export class Membership extends AggregateRoot<MembershipProps, MembershipId> {
  private constructor(props: MembershipProps, id: MembershipId) {
    super(props, id);
  }

  get userId(): UserId { return this.props.userId; }
  get workspaceRef(): WorkspaceRef { return this.props.workspaceRef; }
  get roleId(): WorkspaceRoleId { return this.props.roleId; }
  get status(): MembershipStatus { return this.props.status; }
  get isActive(): boolean { return this.props.status === MembershipStatus.Accepted; }

  /** Factory: reconstitute from persistence. */
  public static initialize(props: MembershipProps, id: MembershipId): Membership {
    return new Membership(props, id);
  }

  /** Factory: create a new membership via invitation – fires MembershipCreated. */
  public static invite(props: Omit<MembershipProps, 'status'>, id: MembershipId): Membership {
    const membership = new Membership({ ...props, status: MembershipStatus.Invited }, id);
    membership.addDomainEvent(
      new MembershipCreated(
        id,
        props.userId.value,
        props.workspaceRef.value,
        props.roleId.value,
      ),
    );
    return membership;
  }

  /** Move from Invited → Pending (user acknowledged the invitation). */
  public acknowledge(): void {
    this.guardNotRevoked('acknowledge');

    if (this.props.status !== MembershipStatus.Invited) {
      throw new InvalidMembershipTransitionException(
        `Cannot acknowledge membership '${this.id.value}' in status '${this.props.status}'`,
      );
    }

    this.props.status = MembershipStatus.Pending;
  }

  /** Move from Pending → Accepted (workspace confirms membership). */
  public accept(): void {
    this.guardNotRevoked('accept');

    if (
      this.props.status !== MembershipStatus.Pending &&
      this.props.status !== MembershipStatus.Invited
    ) {
      throw new InvalidMembershipTransitionException(
        `Cannot accept membership '${this.id.value}' in status '${this.props.status}'`,
      );
    }

    this.props.status = MembershipStatus.Accepted;
    this.addDomainEvent(
      new MembershipAccepted(this.id, this.props.userId.value, this.props.workspaceRef.value),
    );
  }

  /** Suspend a membership – Active → Suspended. */
  public suspend(reason: string): void {
    this.guardNotRevoked('suspend');

    if (this.props.status === MembershipStatus.Suspended) {
      return; // idempotent
    }

    if (this.props.status !== MembershipStatus.Accepted) {
      throw new InvalidMembershipTransitionException(
        `Cannot suspend membership '${this.id.value}' in status '${this.props.status}'`,
      );
    }

    this.props.status = MembershipStatus.Suspended;
    this.addDomainEvent(new MembershipSuspended(this.id, reason));
  }

  /** Revoke a membership permanently. Cannot be undone. */
  public revoke(): void {
    if (this.props.status === MembershipStatus.Revoked) {
      return; // idempotent
    }

    this.props.status = MembershipStatus.Revoked;
    this.addDomainEvent(new MembershipRevoked(this.id, this.props.workspaceRef.value));
  }

  /** Assign a different role to this member. */
  public assignRole(newRoleId: WorkspaceRoleId): void {
    this.guardNotRevoked('assignRole');

    const previousRoleId = this.props.roleId.value;
    this.props.roleId = newRoleId;
    this.addDomainEvent(
      new MemberRoleChanged(this.id, previousRoleId, newRoleId.value),
    );
  }

  private guardNotRevoked(operation: string): void {
    if (this.props.status === MembershipStatus.Revoked) {
      throw new MembershipAlreadyRevokedException(
        `Cannot perform '${operation}' on revoked membership '${this.id.value}'`,
      );
    }
  }
}
