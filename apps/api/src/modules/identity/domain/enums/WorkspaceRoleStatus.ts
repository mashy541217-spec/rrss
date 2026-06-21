/**
 * Lifecycle states of a WorkspaceRole.
 */
export enum WorkspaceRoleStatus {
  /** Role is active and can be assigned to members. */
  Active = 'Active',
  /** Role is inactive; cannot be assigned to new members. */
  Inactive = 'Inactive',
}
