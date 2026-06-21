export class CompleteExecutionStepCommand {
  constructor(
    public readonly executionId: string,
    public readonly stepId: string,
    public readonly output?: string,
  ) {}
}
