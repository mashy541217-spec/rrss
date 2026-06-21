/**
 * ExecutionStepStatus – state machine for a single ExecutionStep.
 *
 * Transitions:
 *   Pending → Running
 *   Running → Completed | Failed | Retrying
 *   Retrying → Running
 *   Failed | Completed → (terminal)
 *   Pending → Skipped   (when parent execution is cancelled)
 */
export enum ExecutionStepStatus {
  Pending = 'Pending',
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
  Retrying = 'Retrying',
  Skipped = 'Skipped',
}

export const TERMINAL_STEP_STATUSES: readonly ExecutionStepStatus[] = [
  ExecutionStepStatus.Completed,
  ExecutionStepStatus.Failed,
  ExecutionStepStatus.Skipped,
];
