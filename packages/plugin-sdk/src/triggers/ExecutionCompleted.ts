export interface ExecutionCompletedEvent {
  readonly executionId: string;
  readonly totalSteps: number;
  readonly completedSteps: number;
  readonly status: string;
  readonly finishedAt: Date;
}
