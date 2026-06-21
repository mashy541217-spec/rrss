import { ExecutionStep } from '../../../../../../apps/api/src/modules/execution/domain/aggregates/ExecutionStep';
import { ExecutionStepId } from '../../../../../../apps/api/src/modules/execution/domain/value-objects/ExecutionStepId';
import { IExecutionStepRepository } from '../../../../../../apps/api/src/modules/execution/domain/repositories/IExecutionStepRepository';


export class FakeExecutionStepRepository implements IExecutionStepRepository {
  private readonly items = new Map<string, ExecutionStep>();

  public async save(step: ExecutionStep): Promise<void> {
    this.items.set(step.id.value, step);
  }

  public async findById(id: ExecutionStepId): Promise<ExecutionStep | null> {
    return this.items.get(id.value) || null;
  }

  public async delete(id: ExecutionStepId): Promise<void> {
    this.items.delete(id.value);
  }

  public async findByExecutionId(executionId: string): Promise<ExecutionStep[]> {
    const all = Array.from(this.items.values());
    return all.filter((s) => s.executionId === executionId).sort((a, b) => a.order - b.order);
  }

  public async findByIdempotencyKey(key: string): Promise<ExecutionStep | null> {
    const all = Array.from(this.items.values());
    return all.find((s) => s.idempotencyKey.value === key) || null;
  }
}
