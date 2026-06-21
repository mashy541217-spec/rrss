import { IEventBus } from '@rrss-auto/application';
import { CancelExecutionCommand } from './CancelExecutionCommand';
import { IExecutionRepository } from '../../../domain/repositories/IExecutionRepository';
import { ExecutionId } from '../../../domain/value-objects/ExecutionId';
import { ExecutionNotFoundException } from '../../../domain/exceptions/ExecutionNotFoundException';

export class CancelExecutionUseCase {
  constructor(
    private readonly executionRepository: IExecutionRepository,
    private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: CancelExecutionCommand): Promise<void> {
    const executionId = ExecutionId.create(command.executionId);
    const execution = await this.executionRepository.findById(executionId);
    if (!execution) {
      throw new ExecutionNotFoundException(`Execution not found: ${command.executionId}`);
    }

    execution.requestCancel(command.reason, command.cancelledBy);

    await this.executionRepository.save(execution);
    await this.eventBus.publishAll(execution.domainEvents);
    execution.clearDomainEvents();
  }
}
