import { IIdentifierProvider } from '@rrss-auto/domain';
import { Execution, ExecutionProps } from '../aggregates/Execution';
import { ExecutionId } from '../value-objects/ExecutionId';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { IdempotencyKey } from '../value-objects/IdempotencyKey';
import { RetryPolicy } from '../value-objects/RetryPolicy';
import { ExecutionContext } from '../value-objects/ExecutionContext';
import { ExecutionPriority } from '../enums/ExecutionPriority';
import { CapabilityRequirement } from '../value-objects/CapabilityRequirement';

export interface CreateExecutionInput {
  id?: ExecutionId;
  workspaceRef: string;
  actor: string;
  intent: string;
  priority?: ExecutionPriority;
  idempotencyKey: string;
  retryPolicy?: RetryPolicy;
  capabilities?: CapabilityRequirement[];
  policyRef?: string;
  scheduledFor?: Date;
}

export class ExecutionFactory {
  public static create(input: CreateExecutionInput, identifierProvider: IIdentifierProvider): Execution {
    const id = input.id ?? ExecutionId.create(identifierProvider.nextId());
    const workspaceRef = WorkspaceRef.create(input.workspaceRef);
    const idempotencyKey = IdempotencyKey.create(input.idempotencyKey);
    const priority = input.priority ?? ExecutionPriority.Standard;
    const context = ExecutionContext.create({
      workspaceRef: input.workspaceRef,
      actor: input.actor,
      intent: input.intent,
      priority,
      policyRef: input.policyRef,
      scheduledFor: input.scheduledFor,
    });

    return Execution.request(
      {
        context,
        workspaceRef,
        idempotencyKey,
        retryPolicy: input.retryPolicy ?? RetryPolicy.DEFAULT,
        failure: undefined,
        capabilities: input.capabilities ?? [],
        assignedWorkerId: undefined,
      },
      id,
    );
  }

  public static reconstitute(props: ExecutionProps, id: ExecutionId): Execution {
    return Execution.initialize(props, id);
  }
}
