/**
 * JobStatus – state machine for a Job aggregate.
 *
 * Transitions (from RFC-0001):
 *   Created → Ready → Enqueued → Claimed → LeaseActive
 *   LeaseActive → Acknowledged | TimedOut | DeadLettered
 *   TimedOut → Enqueued  (safe requeue)
 */
export enum JobStatus {
  Created = 'Created',
  Ready = 'Ready',
  Enqueued = 'Enqueued',
  Claimed = 'Claimed',
  LeaseActive = 'LeaseActive',
  Acknowledged = 'Acknowledged',
  TimedOut = 'TimedOut',
  DeadLettered = 'DeadLettered',
}

export const TERMINAL_JOB_STATUSES: readonly JobStatus[] = [
  JobStatus.Acknowledged,
  JobStatus.DeadLettered,
];
