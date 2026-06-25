import { Injectable } from '@nestjs/common';
import { ExecutionStep as PrismaExecutionStep } from '@prisma/client';
import { AggregateMapper } from '../../../../../infrastructure/database/mappers/AggregateMapper';
import { PersistenceMapper } from '../../../../../infrastructure/database/mappers/PersistenceMapper';
import { ExecutionStep, ExecutionStepProps } from '../../../domain/aggregates/ExecutionStep';
import { ExecutionStepId } from '../../../domain/value-objects/ExecutionStepId';
import { IdempotencyKey } from '../../../domain/value-objects/IdempotencyKey';
import { FailureClassification } from '../../../domain/value-objects/FailureClassification';
import { ExecutionStepStatus } from '../../../domain/enums/ExecutionStepStatus';
import { CapabilityType } from '../../../domain/enums/CapabilityType';

@Injectable()
export class ExecutionStepMapper
  implements
    AggregateMapper<ExecutionStep, ExecutionStepId, PrismaExecutionStep>,
    PersistenceMapper<ExecutionStep, ExecutionStepId, PrismaExecutionStep>
{
  toDomain(model: PrismaExecutionStep): ExecutionStep {
    let failure: FailureClassification | undefined;
    if (model.failure) {
      const f = model.failure as any;
      failure = FailureClassification.create({
        type: f.type,
        reason: f.reason,
        isRecoverable: f.isRecoverable,
      });
    }

    const props: ExecutionStepProps = {
      executionId: model.executionId,
      order: model.order,
      name: model.name,
      description: model.description,
      capabilityType: model.capabilityType as CapabilityType,
      idempotencyKey: IdempotencyKey.create(model.idempotencyKey),
      status: model.status as ExecutionStepStatus,
      output: model.output ?? undefined,
      failure,
      retryAttempts: model.retryAttempts,
      startedAt: model.startedAt ?? undefined,
      completedAt: model.completedAt ?? undefined,
    };

    const step = ExecutionStep.initialize(props, ExecutionStepId.create(model.id));
    (step as any)['_version'] = model.version;
    step.clearDomainEvents();
    return step;
  }

  toPersistence(aggregate: ExecutionStep): PrismaExecutionStep {
    const version = (aggregate as any)['_version'] || 1;

    return {
      id: aggregate.id.value,
      executionId: aggregate.executionId,
      order: aggregate.order,
      name: aggregate.name,
      description: aggregate.description,
      capabilityType: aggregate.capabilityType,
      idempotencyKey: aggregate.idempotencyKey.value,
      status: aggregate.status,
      output: aggregate.output ?? null,
      failure: aggregate.failure ? {
        type: aggregate.failure.type,
        reason: aggregate.failure.reason,
        isRecoverable: aggregate.failure.isRecoverable,
      } as any : null,
      retryAttempts: aggregate.retryAttempts,
      startedAt: aggregate.startedAt ?? null,
      completedAt: aggregate.completedAt ?? null,
      version: version,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
