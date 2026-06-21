import { CapabilityRequirement } from '../../../domain/value-objects/CapabilityRequirement';
import { ExecutionPriority } from '../../../domain/enums/ExecutionPriority';

export class RequestExecutionCommand {
  constructor(
    public readonly workspaceRef: string,
    public readonly actor: string,
    public readonly intent: string,
    public readonly idempotencyKey: string,
    public readonly priority?: ExecutionPriority,
    public readonly capabilities?: CapabilityRequirement[],
    public readonly policyRef?: string,
    public readonly scheduledFor?: Date,
  ) {}
}
