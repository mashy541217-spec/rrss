/**
 * Supports logical deletion instead of physical deletion.
 * Useful for restoring records and keeping referential integrity in history.
 */
export interface SoftDeleteSupport {
  isDeleted: boolean;
  deletedAt: Date | null;
}

/**
 * Common Prisma arguments applied to hide soft-deleted records globally.
 */
export const SoftDeleteQueryFilters = {
  isDeleted: false,
};
