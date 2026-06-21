/**
 * Lifecycle states of a workspace Invitation.
 *
 * Pending → Accepted | Expired | Cancelled
 */
export enum InvitationStatus {
  /** Invitation sent and awaiting response. */
  Pending = 'Pending',
  /** Invitation accepted by the recipient. */
  Accepted = 'Accepted',
  /** Invitation expired due to time limit. */
  Expired = 'Expired',
  /** Invitation cancelled by the sender or an administrator. */
  Cancelled = 'Cancelled',
}
