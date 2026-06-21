/**
 * WorkerStatus – lifecycle of a Worker process.
 *
 * Transitions (from RFC-0001):
 *   Starting → Registering → Idle → Polling → ClaimedJob
 *   ClaimedJob → LeasingResources → Executing → Reporting → ReleasingResources → Idle
 *
 *   Idle | Polling | Executing → Draining → Stopped
 *   Starting | Executing → Unhealthy → Stopped
 */
export enum WorkerStatus {
  Starting = 'Starting',
  Registering = 'Registering',
  Idle = 'Idle',
  Polling = 'Polling',
  ClaimedJob = 'ClaimedJob',
  LeasingResources = 'LeasingResources',
  Executing = 'Executing',
  Reporting = 'Reporting',
  ReleasingResources = 'ReleasingResources',
  Draining = 'Draining',
  Unhealthy = 'Unhealthy',
  Stopped = 'Stopped',
}
