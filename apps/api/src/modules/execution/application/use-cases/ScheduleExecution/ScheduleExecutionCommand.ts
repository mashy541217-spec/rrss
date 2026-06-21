export class ScheduleExecutionCommand {
  constructor(
    public readonly executionId: string,
    public readonly scheduledFor?: Date,
  ) {}
}
