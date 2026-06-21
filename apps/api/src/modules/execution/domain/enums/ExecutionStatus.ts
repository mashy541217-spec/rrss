/**
 * ExecutionStatus – canonical state machine for an Execution aggregate.
 *
 * Transitions (from RFC-0001 and Blueprint-0006):
 *
 *   Requested → Accepted | Rejected
 *   Accepted  → Planned
 *   Planned   → Scheduled
 *   Scheduled → Queued
 *   Queued    → LeasingResources
 *   LeasingResources → Running | WaitingForResources
 *   WaitingForResources → Queued
 *   Running   → StepRunning | WaitingExternal | Retrying | Completed | Failed | CancelRequested
 *   WaitingExternal → Queued
 *   Retrying  → Queued
 *   CancelRequested → Cancelled
 *
 *   Terminal: Completed | Failed | Cancelled | Rejected | Archived
 */
export enum ExecutionStatus {
  Requested = 'Requested',
  Accepted = 'Accepted',
  Planned = 'Planned',
  Scheduled = 'Scheduled',
  Queued = 'Queued',
  LeasingResources = 'LeasingResources',
  WaitingForResources = 'WaitingForResources',
  Running = 'Running',
  WaitingExternal = 'WaitingExternal',
  Retrying = 'Retrying',
  CancelRequested = 'CancelRequested',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
  Rejected = 'Rejected',
  Archived = 'Archived',
}

export const TERMINAL_EXECUTION_STATUSES: readonly ExecutionStatus[] = [
  ExecutionStatus.Completed,
  ExecutionStatus.Failed,
  ExecutionStatus.Cancelled,
  ExecutionStatus.Rejected,
  ExecutionStatus.Archived,
];
