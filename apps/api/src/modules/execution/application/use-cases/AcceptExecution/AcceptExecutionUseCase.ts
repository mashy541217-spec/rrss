import { IEventBus } from '@rrss-auto/application';
import { AcceptExecutionCommand } from './AcceptExecutionCommand';
import { IExecutionRepository } from '../../../domain/repositories/IExecutionRepository';
import { ExecutionId } from '../../../domain/value-objects/ExecutionId';
import { ExecutionNotFoundException } from '../../../domain/exceptions/ExecutionNotFoundException';

export class AcceptExecutionUseCase {
  constructor(
    private readonly executionRepository: IExecutionRepository,
    private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: AcceptExecutionCommand): Promise<void> {
    const id = ExecutionId.create(command.executionId);
    const execution = await this.executionRepository.findById(id);

    if (!execution) {
      throw new ExecutionNotFoundException(`Execution not found: ${command.executionId}`);
    }

    execution.accept();

    await this.executionRepository.save(execution);
    await this.eventBus.publishAll(execution.domainEvents);
    execution.clearDomainEvents();
  }
}
