/**
 * Lifecycle states of a platform User identity.
 *
 * PendingVerification → Active → Suspended → Deleted
 */
export enum UserStatus {
  /** Account created; email/identity not yet verified. */
  PendingVerification = 'PendingVerification',
  /** Identity verified and fully operational. */
  Active = 'Active',
  /** Account suspended by administrator or policy. */
  Suspended = 'Suspended',
  /** Account permanently deleted. Cannot be reinstated. */
  Deleted = 'Deleted',
}
