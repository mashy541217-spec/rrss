import { IRepository } from '@rrss-auto/domain';
import { Execution } from '../aggregates/Execution';
import { ExecutionId } from '../value-objects/ExecutionId';
import { IdempotencyKey } from '../value-objects/IdempotencyKey';
import { WorkspaceRef } from '../value-objects/WorkspaceRef';
import { ExecutionStatus } from '../enums/ExecutionStatus';

export interface IExecutionRepository extends IRepository<Execution, ExecutionId> {
  save(execution: Execution): Promise<void>;
  findById(id: ExecutionId): Promise<Execution | null>;
  delete(id: ExecutionId): Promise<void>;
  findByIdempotencyKey(key: IdempotencyKey): Promise<Execution | null>;
  findByWorkspace(workspaceRef: WorkspaceRef, status?: ExecutionStatus): Promise<Execution[]>;
  existsByIdempotencyKey(key: IdempotencyKey): Promise<boolean>;
}
