/**
 * FailureType – classification of failures per RFC-0001 recovery model.
 *
 * - Transient: temporary timeout/saturation → retry with backoff
 * - Resource: VM/proxy/AI unavailable → reallocate
 * - Policy: execution no longer satisfies rules → pause or fail
 * - External: external system rejected → record reason, avoid dangerous retries
 * - Fatal: unrecoverable inconsistency → dead-letter and report
 */
export enum FailureType {
  Transient = 'Transient',
  Resource = 'Resource',
  Policy = 'Policy',
  External = 'External',
  Fatal = 'Fatal',
}
