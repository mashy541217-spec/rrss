import { IEventBus } from '@rrss-auto/application';
import { CompleteExecutionStepCommand } from './CompleteExecutionStepCommand';
import { IExecutionRepository } from '../../../domain/repositories/IExecutionRepository';
import { IExecutionStepRepository } from '../../../domain/repositories/IExecutionStepRepository';
import { ExecutionId } from '../../../domain/value-objects/ExecutionId';
import { ExecutionStepId } from '../../../domain/value-objects/ExecutionStepId';
import { ExecutionNotFoundException } from '../../../domain/exceptions/ExecutionNotFoundException';
import { ExecutionStepNotFoundException } from '../../../domain/exceptions/ExecutionStepNotFoundException';

export class CompleteExecutionStepUseCase {
  constructor(
    private readonly executionRepository: IExecutionRepository,
    private readonly stepRepository: IExecutionStepRepository,
    private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: CompleteExecutionStepCommand): Promise<void> {
    const executionId = ExecutionId.create(command.executionId);
    const execution = await this.executionRepository.findById(executionId);
    if (!execution) {
      throw new ExecutionNotFoundException(`Execution not found: ${command.executionId}`);
    }

    const stepId = ExecutionStepId.create(command.stepId);
    const step = await this.stepRepository.findById(stepId);
    if (!step) {
      throw new ExecutionStepNotFoundException(`Step not found: ${command.stepId}`);
    }

    step.complete(command.output);
    execution.recordStepCompleted();

    await this.stepRepository.save(step);
    await this.executionRepository.save(execution);

    await this.eventBus.publishAll(step.domainEvents);
    await this.eventBus.publishAll(execution.domainEvents);

    step.clearDomainEvents();
    execution.clearDomainEvents();
  }
}
