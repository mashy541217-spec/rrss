import { IEventBus } from '@rrss-auto/application';
import { FailExecutionCommand } from './FailExecutionCommand';
import { IExecutionRepository } from '../../../domain/repositories/IExecutionRepository';
import { IExecutionStepRepository } from '../../../domain/repositories/IExecutionStepRepository';
import { ExecutionId } from '../../../domain/value-objects/ExecutionId';
import { ExecutionStepId } from '../../../domain/value-objects/ExecutionStepId';
import { ExecutionNotFoundException } from '../../../domain/exceptions/ExecutionNotFoundException';
import { ExecutionStepNotFoundException } from '../../../domain/exceptions/ExecutionStepNotFoundException';
import { FailureClassification } from '../../../domain/value-objects/FailureClassification';

export class FailExecutionUseCase {
  constructor(
    private readonly executionRepository: IExecutionRepository,
    private readonly stepRepository: IExecutionStepRepository,
    private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: FailExecutionCommand): Promise<void> {
    const executionId = ExecutionId.create(command.executionId);
    const execution = await this.executionRepository.findById(executionId);
    if (!execution) {
      throw new ExecutionNotFoundException(`Execution not found: ${command.executionId}`);
    }

    const failure = FailureClassification.create({
      type: command.failureType,
      reason: command.reason,
      isRecoverable: ['Transient', 'Resource'].includes(command.failureType),
    });

    if (command.stepId) {
      const stepId = ExecutionStepId.create(command.stepId);
      const step = await this.stepRepository.findById(stepId);
      if (!step) {
        throw new ExecutionStepNotFoundException(`Step not found: ${command.stepId}`);
      }
      step.fail(failure);
      await this.stepRepository.save(step);
      await this.eventBus.publishAll(step.domainEvents);
      step.clearDomainEvents();
    }

    execution.fail(failure);

    await this.executionRepository.save(execution);
    await this.eventBus.publishAll(execution.domainEvents);
    execution.clearDomainEvents();
  }
}
