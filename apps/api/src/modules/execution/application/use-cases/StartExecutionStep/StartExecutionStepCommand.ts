export class StartExecutionStepCommand {
  constructor(
    public readonly executionId: string,
    public readonly stepId: string,
    public readonly workerId: string,
  ) {}
}
