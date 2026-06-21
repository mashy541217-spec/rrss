import { Execution } from '../../../../../../apps/api/src/modules/execution/domain/aggregates/Execution';
import { ExecutionId } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/ExecutionId';
import { IdempotencyKey } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/IdempotencyKey';
import { WorkspaceRef } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/WorkspaceRef';
import { ExecutionStatus } from '../../../../../../apps/api/src/modules/execution/domain/enums/ExecutionStatus';
import { IExecutionRepository } from '../../../../../../apps/api/src/modules/execution/domain/repositories/IExecutionRepository';


export class FakeExecutionRepository implements IExecutionRepository {
  private readonly items = new Map<string, Execution>();

  public async save(execution: Execution): Promise<void> {
    this.items.set(execution.id.value, execution);
  }

  public async findById(id: ExecutionId): Promise<Execution | null> {
    return this.items.get(id.value) || null;
  }

  public async delete(id: ExecutionId): Promise<void> {
    this.items.delete(id.value);
  }

  public async findByIdempotencyKey(key: IdempotencyKey): Promise<Execution | null> {
    const all = Array.from(this.items.values());
    return all.find((e) => e.idempotencyKey.value === key.value) || null;
  }

  public async findByWorkspace(workspaceRef: WorkspaceRef, status?: ExecutionStatus): Promise<Execution[]> {
    const all = Array.from(this.items.values());
    let filtered = all.filter((e) => e.workspaceRef.value === workspaceRef.value);
    if (status) {
      filtered = filtered.filter((e) => e.status === status);
    }
    return filtered;
  }

  public async existsByIdempotencyKey(key: IdempotencyKey): Promise<boolean> {
    return (await this.findByIdempotencyKey(key)) !== null;
  }
}
