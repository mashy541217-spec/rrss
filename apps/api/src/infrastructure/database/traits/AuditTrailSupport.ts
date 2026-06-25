/**
 * Interface ensuring an entity tracks its lifecycle and who modified it.
 */
export interface AuditTrailSupport {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
}
