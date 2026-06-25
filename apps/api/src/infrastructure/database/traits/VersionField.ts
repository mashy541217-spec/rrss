/**
 * Constants and types related to Version fields in Persistence.
 * Default Prisma field is 'version'.
 */
export const VERSION_FIELD_NAME = 'version';

export type VersionedModel<T> = T & {
  version: number;
};
