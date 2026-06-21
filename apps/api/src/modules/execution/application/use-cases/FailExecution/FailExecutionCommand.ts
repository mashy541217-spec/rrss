import { FailureType } from '../../../domain/enums/FailureType';

export class FailExecutionCommand {
  constructor(
    public readonly executionId: string,
    public readonly failureType: FailureType,
    public readonly reason: string,
    public readonly stepId?: string,
  ) {}
}
