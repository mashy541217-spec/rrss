/**
 * Lifecycle states of a Membership (User ↔ Workspace relationship).
 *
 * Invited → Pending → Accepted → Suspended → Revoked
 */
export enum MembershipStatus {
  /** Invitation sent; user has not yet acknowledged it. */
  Invited = 'Invited',
  /** User acknowledged the invitation; awaiting workspace confirmation. */
  Pending = 'Pending',
  /** Membership is fully active; member can operate in the Workspace. */
  Accepted = 'Accepted',
  /** Membership temporarily blocked by administrator or policy. */
  Suspended = 'Suspended',
  /** Membership permanently revoked. Cannot be reinstated. */
  Revoked = 'Revoked',
}
