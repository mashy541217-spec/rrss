import { CapabilityType } from '../../../domain/enums/CapabilityType';

export interface PlanStepInput {
  order: number;
  name: string;
  description: string;
  capabilityType: CapabilityType;
  idempotencyKey: string;
}

export class PlanExecutionCommand {
  constructor(
    public readonly executionId: string,
    public readonly steps: PlanStepInput[],
  ) {}
}
