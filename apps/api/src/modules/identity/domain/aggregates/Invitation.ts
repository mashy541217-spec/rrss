import { AggregateRoot } from '@rrss-auto/domain';
import { InvitationId } from '../value-objects/InvitationId';
import { Email } from '../value-objects/Email';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { WorkspaceRoleId } from '../value-objects/WorkspaceRoleId';
import { InvitationToken } from '../value-objects/InvitationToken';
import { InvitationStatus } from '../enums/InvitationStatus';
import { InvitationSent } from '../domain-events/InvitationSent';
import { InvitationAccepted } from '../domain-events/InvitationAccepted';
import { InvitationExpired } from '../domain-events/InvitationExpired';
import { InvitationCancelled } from '../domain-events/InvitationCancelled';
import { InvitationAlreadyUsedException } from '../exceptions/InvitationAlreadyUsedException';
import { InvitationExpiredException } from '../exceptions/InvitationExpiredException';

export interface InvitationProps {
  email: Email;
  workspaceRef: WorkspaceRef;
  roleId: WorkspaceRoleId;
  token: InvitationToken;
  status: InvitationStatus;
  expiresAt: Date;
}

/**
 * Invitation – Aggregate Root.
 *
 * Manages the lifecycle of a workspace invitation independently
 * from Membership. An Invitation is separate so it can expire,
 * be cancelled, or be resent without modifying Membership state.
 *
 * Lifecycle: Pending → Accepted | Expired | Cancelled
 *
 * Invariants:
 * - An already-accepted or cancelled invitation cannot be used again.
 * - Accepting a token validates it matches the stored token.
 * - An expired invitation cannot be accepted.
 */
export class Invitation extends AggregateRoot<InvitationProps, InvitationId> {
  private constructor(props: InvitationProps, id: InvitationId) {
    super(props, id);
  }

  get email(): Email { return this.props.email; }
  get workspaceRef(): WorkspaceRef { return this.props.workspaceRef; }
  get roleId(): WorkspaceRoleId { return this.props.roleId; }
  get token(): InvitationToken { return this.props.token; }
  get status(): InvitationStatus { return this.props.status; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get isPending(): boolean { return this.props.status === InvitationStatus.Pending; }
  get isExpired(): boolean { return this.props.status === InvitationStatus.Expired || new Date() > this.props.expiresAt; }

  /** Factory: reconstitute from persistence. */
  public static initialize(props: InvitationProps, id: InvitationId): Invitation {
    return new Invitation(props, id);
  }

  /** Factory: send a new invitation – fires InvitationSent. */
  public static send(props: Omit<InvitationProps, 'status'>, id: InvitationId): Invitation {
    const invitation = new Invitation(
      { ...props, status: InvitationStatus.Pending },
      id,
    );
    invitation.addDomainEvent(
      new InvitationSent(
        id,
        props.email.value,
        props.workspaceRef.value,
        props.roleId.value,
      ),
    );
    return invitation;
  }

  /**
   * Accept the invitation using the provided token and userId.
   * Validates the token and expiry before transitioning.
   */
  public accept(token: string, userId: string): void {
    this.guardNotUsed();
    this.guardNotExpiredByTime();

    if (this.props.token.value !== token) {
      throw new InvitationAlreadyUsedException(
        'Invalid invitation token',
      );
    }

    this.props.status = InvitationStatus.Accepted;
    this.addDomainEvent(
      new InvitationAccepted(this.id, userId, this.props.workspaceRef.value),
    );
  }

  /** Mark invitation as expired (e.g. by a scheduled job). */
  public expire(): void {
    this.guardNotUsed();

    this.props.status = InvitationStatus.Expired;
    this.addDomainEvent(new InvitationExpired(this.id));
  }

  /** Cancel the invitation explicitly. */
  public cancel(): void {
    this.guardNotUsed();

    this.props.status = InvitationStatus.Cancelled;
    this.addDomainEvent(new InvitationCancelled(this.id));
  }

  private guardNotUsed(): void {
    if (
      this.props.status === InvitationStatus.Accepted ||
      this.props.status === InvitationStatus.Cancelled
    ) {
      throw new InvitationAlreadyUsedException(
        `Invitation '${this.id.value}' has already been ${this.props.status.toLowerCase()}`,
      );
    }
  }

  private guardNotExpiredByTime(): void {
    if (new Date() > this.props.expiresAt) {
      throw new InvitationExpiredException(
        `Invitation '${this.id.value}' has expired`,
      );
    }
  }
}
