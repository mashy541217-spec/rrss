/**
 * Standard runtime environments for the platform.
 *
 * Used to determine behavior that varies by deployment
 * context (e.g., logging verbosity, error detail exposure).
 */
export enum Environment {
  /** Local development workstation. */
  Development = 'development',

  /** Continuous integration / build pipeline. */
  Test = 'test',

  /** Pre-production staging environment. */
  Staging = 'staging',

  /** Live production environment. */
  Production = 'production',
}
