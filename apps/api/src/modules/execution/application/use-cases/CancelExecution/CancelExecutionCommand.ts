export class CancelExecutionCommand {
  constructor(
    public readonly executionId: string,
    public readonly reason: string,
    public readonly cancelledBy: string,
  ) {}
}
