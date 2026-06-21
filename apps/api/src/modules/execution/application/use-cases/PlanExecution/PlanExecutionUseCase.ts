import { IIdentifierProvider } from '@rrss-auto/domain';
import { IEventBus, ApplicationException } from '@rrss-auto/application';
import { PlanExecutionCommand } from './PlanExecutionCommand';
import { IExecutionRepository } from '../../../domain/repositories/IExecutionRepository';
import { IExecutionStepRepository } from '../../../domain/repositories/IExecutionStepRepository';
import { ExecutionStepFactory } from '../../../domain/factories/ExecutionStepFactory';
import { ExecutionId } from '../../../domain/value-objects/ExecutionId';
import { ExecutionNotFoundException } from '../../../domain/exceptions/ExecutionNotFoundException';

export class PlanExecutionUseCase {
  constructor(
    private readonly executionRepository: IExecutionRepository,
    private readonly stepRepository: IExecutionStepRepository,
    private readonly eventBus: IEventBus,
    private readonly identifierProvider: IIdentifierProvider,
  ) {}

  public async execute(command: PlanExecutionCommand): Promise<void> {
    const id = ExecutionId.create(command.executionId);
    const execution = await this.executionRepository.findById(id);

    if (!execution) {
      throw new ExecutionNotFoundException(`Execution not found: ${command.executionId}`);
    }

    if (command.steps.length === 0) {
      throw new ApplicationException('Cannot plan execution with 0 steps');
    }

    execution.plan(command.steps.length);

    for (const stepInput of command.steps) {
      const step = ExecutionStepFactory.create({
        rawId: this.identifierProvider.nextId(),
        executionId: command.executionId,
        order: stepInput.order,
        name: stepInput.name,
        description: stepInput.description,
        capabilityType: stepInput.capabilityType,
        idempotencyKey: stepInput.idempotencyKey,
      });

      await this.stepRepository.save(step);
    }

    await this.executionRepository.save(execution);
    await this.eventBus.publishAll(execution.domainEvents);
    execution.clearDomainEvents();
  }
}
