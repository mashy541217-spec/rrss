import { ExecutionStep, ExecutionStepProps } from '../aggregates/ExecutionStep';
import { ExecutionStepId } from '../value-objects/ExecutionStepId';
import { IdempotencyKey } from '../value-objects/IdempotencyKey';
import { CapabilityType } from '../enums/CapabilityType';

export interface CreateStepInput {
  id?: ExecutionStepId;
  rawId: string;
  executionId: string;
  order: number;
  name: string;
  description: string;
  capabilityType: CapabilityType;
  idempotencyKey: string;
}

export class ExecutionStepFactory {
  public static create(input: CreateStepInput): ExecutionStep {
    const id = input.id ?? ExecutionStepId.create(input.rawId);
    const idempotencyKey = IdempotencyKey.create(input.idempotencyKey);
    return ExecutionStep.createNew(
      {
        executionId: input.executionId,
        order: input.order,
        name: input.name,
        description: input.description,
        capabilityType: input.capabilityType,
        idempotencyKey,
      },
      id,
    );
  }

  public static reconstitute(props: ExecutionStepProps, id: ExecutionStepId): ExecutionStep {
    return ExecutionStep.initialize(props, id);
  }
}
