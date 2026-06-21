import { IRepository } from '@rrss-auto/domain';
import { ExecutionStep } from '../aggregates/ExecutionStep';
import { ExecutionStepId } from '../value-objects/ExecutionStepId';

export interface IExecutionStepRepository extends IRepository<ExecutionStep, ExecutionStepId> {
  save(step: ExecutionStep): Promise<void>;
  findById(id: ExecutionStepId): Promise<ExecutionStep | null>;
  delete(id: ExecutionStepId): Promise<void>;
  findByExecutionId(executionId: string): Promise<ExecutionStep[]>;
  findByIdempotencyKey(key: string): Promise<ExecutionStep | null>;
}
